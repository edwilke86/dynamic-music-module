/**
 * Music player functionality
 * This uses Foundry's built-in playlist functionality directly
 */

window.DMM = window.DMM || {};

/**
 * Play a specific song by name from the playlist
 * @param {string} songName - The name of the song to play
 */
async function playDynamicSong(songName) {
  // First, stop any currently playing playlists
  await stopAllMusic();
  
  // Find the requested playlist
  const playlist = game.playlists.find(p => p.name === songName);
  if (!playlist) {
    ui.notifications.error(`Song "${songName}" not found in playlists.`);
    return;
  }
  
  // Find the corresponding song data in our library
  const songData = window.DMM.songLibrary.find(s => s.name === songName);
  if (!songData) {
    ui.notifications.warn(`Song data for "${songName}" not found, playing anyway.`);
    return;
  }
  
  // Play the playlist with all tracks initially
  console.log(`%cDynamic Music Module | Playing: ${songName}`, "color: #00ccff;");
  await playlist.playAll();
  
  // Save playback state
  window.DMM.playbackState = {
    playlist: playlist,
    song: songData,
    tracks: [], // Will be populated with track info
    timers: [],
    startTime: Date.now()
  };

  // Populate the track information
  for (const sound of playlist.sounds) {
    if (sound.playing && sound.sound) {
      window.DMM.playbackState.tracks.push({
        id: sound.id,
        soundId: sound.sound.id,
        sound: sound.sound,
        isAudible: true,
        name: sound.name
      });
    }
  }

  // Schedule the first randomization
  scheduleNextTransition(songData.duration);
  
  // Call hook to update UI
  Hooks.callAll("dmm.songUpdate");
}

/**
 * Schedule the next track randomization transition
 * @param {number} songDuration - Duration of the song in milliseconds
 */
function scheduleNextTransition(songDuration) {
  const state = window.DMM.playbackState;
  if (!state) return;

  // Clear any previous timers
  if (state.timers.length) {
    for (const timer of state.timers) {
      clearTimeout(timer);
    }
    state.timers = [];
  }

  const FADE_DURATION = window.DMM.CONSTANTS.FADE_DURATION_MS;
  const halfwayPoint = songDuration / 2;
  const fadePoint = songDuration - FADE_DURATION;

  // Timer for planning the next transition halfway through
  const decisionTimer = setTimeout(() => {
    console.log(`%cDMM | Mid-loop: Planning next transition...`, "color: #00ccff;");
    planNextTrackMix();
  }, halfwayPoint);

  // Timer for executing the transition near the end of the loop
  const fadeTimer = setTimeout(() => {
    console.log(`%cDMM | End-loop: Executing transitions...`, "color: #00ccff;");
    executeTrackMix();
    
    // Schedule the next round of transitions for the next loop
    const loopTimer = setTimeout(() => {
      scheduleNextTransition(songDuration);
    }, FADE_DURATION);
    
    state.timers.push(loopTimer);
  }, fadePoint);

  state.timers.push(decisionTimer, fadeTimer);
}

/**
 * Plan which tracks should be audible in the next loop
 */
function planNextTrackMix() {
  const state = window.DMM.playbackState;
  if (!state || !state.tracks || state.tracks.length === 0) return;

  const tracks = state.tracks;
  
  // Decide how many tracks to make audible (minimum 2 or half, whichever is larger)
  const minTracks = Math.max(2, Math.floor(tracks.length / 2));
  const maxTracks = tracks.length;
  const tracksToPlay = Math.floor(Math.random() * (maxTracks - minTracks + 1)) + minTracks;
  
  // Shuffle the tracks and pick the first N
  const shuffledIndices = Array.from({length: tracks.length}, (_, i) => i).sort(() => Math.random() - 0.5);
  const selectedIndices = shuffledIndices.slice(0, tracksToPlay);
  
  // Store the plan for later execution
  state.nextTrackMix = {
    audibleIndices: selectedIndices,
    volumes: selectedIndices.map(() => 0.33 + Math.random() * 0.67) // Random volume between 33% and 100%
  };
  
  console.log(`%cDMM | Next mix will have ${tracksToPlay} audible tracks`, "color: #00ccff;");
}

/**
 * Execute the planned track mix by fading tracks in/out
 */
async function executeTrackMix() {
  const state = window.DMM.playbackState;
  if (!state || !state.tracks || !state.nextTrackMix) return;

  const FADE_DURATION = window.DMM.CONSTANTS.FADE_DURATION_MS;
  const { audibleIndices, volumes } = state.nextTrackMix;

  // Update each track
  for (let i = 0; i < state.tracks.length; i++) {
    const track = state.tracks[i];
    const sound = track.sound;
    if (!sound) continue;
    
    // Should this track be audible?
    const willBeAudible = audibleIndices.includes(i);
    
    if (willBeAudible) {
      // Set a new random volume between 66% and 100%
      const volumeIndex = audibleIndices.indexOf(i);
      const targetVolume = volumes[volumeIndex]; 
      
      if (!track.isAudible) {
        // Fade in if previously inaudible
        console.log(`%cDMM | Fading IN track: ${track.name} (${Math.round(targetVolume * 100)}%)`, "color: #00ccff;");
        await sound.fade(targetVolume, { duration: FADE_DURATION });
        track.isAudible = true;
      } else {
        // Just adjust volume if already playing
        console.log(`%cDMM | Adjusting volume: ${track.name} (${Math.round(targetVolume * 100)}%)`, "color: #00ccff;");
        await sound.fade(targetVolume, { duration: FADE_DURATION });
      }
    } 
    else if (track.isAudible) {
      // Fade out if previously audible but not in the new mix
      console.log(`%cDMM | Fading OUT track: ${track.name}`, "color: #00ccff;");
      await sound.fade(0.0, { duration: FADE_DURATION });
      track.isAudible = false;
    }
  }
  
  // Update UI
  Hooks.callAll("dmm.songUpdate");
}

/**
 * Stop all currently playing music
 */
async function stopAllMusic() {
  // Stop all timers
  if (window.DMM.playbackState && window.DMM.playbackState.timers) {
    for (const timer of window.DMM.playbackState.timers) {
      clearTimeout(timer);
    }
  }
  
  // Get all playing playlists
  const playingPlaylists = game.playlists.filter(p => p.playing);
  
  // Stop each one
  for (const playlist of playingPlaylists) {
    console.log(`%cDynamic Music Module | Stopping: ${playlist.name}`, "color: #00ccff;");
    await playlist.stopAll();
  }
  
  // Clear playback state
  window.DMM.playbackState = null;
  
  // Call hook to update UI
  Hooks.callAll("dmm.songUpdate");
}

// Attach functions to the DMM object
window.DMM.playDynamicSong = playDynamicSong;
window.DMM.stopAllMusic = stopAllMusic;

console.log("%cDynamic Music Module | Music Player Initialized", "color: #00ccff;");

