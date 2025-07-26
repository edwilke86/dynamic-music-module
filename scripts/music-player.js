window.DMM = window.DMM || {};
window.DMM.playbackState = null; // This will hold all our playback info

const FADE_DURATION_MS = 2000;
const basePath = "modules/dynamic-music-module/";

/**
 * Main function to start a dynamic song.
 * This will start ALL tracks of the song, looping, and then schedule the dynamic fades.
 * @param {string} songName - The name of the song from the song library.
 */
async function playDynamicSong(songName) {
  // 1. Stop any music that is currently playing.
  stopDynamicMusic();

  const song = window.DMM.songLibrary.find(s => s.name === songName);
  if (!song) {
    return console.error(`DMM | Song "${songName}" not found.`);
  }

  console.log(`DMM | Initializing "${song.name}"...`);

  // 2. Initialize the global playback state object.
  window.DMM.playbackState = {
    song: song,
    tracks: [], // Will be [{ sound: Sound, isAudible: boolean, src: string }]
    timers: [],  // To keep track of our setTimeout IDs
    startTime: Date.now() // Add this line to record when playback begins
  };

  // 3. Start ALL tracks simultaneously, at full volume, and set to loop.
  const soundPromises = song.tracks.map(trackPath =>
    foundry.audio.AudioHelper.play({
      src: `${basePath}${trackPath}`,
      volume: 1.0,
      loop: true,
      autoplay: true
    }, true)
  );

  const sounds = await Promise.all(soundPromises);

  // 4. Populate our state tracker. Initially, all tracks are audible.
  for (let i = 0; i < sounds.length; i++) {
    if (sounds[i]) {
      window.DMM.playbackState.tracks.push({
        sound: sounds[i],
        isAudible: true,
        src: song.tracks[i]
      });
    }
  }

  console.log(`DMM | All ${window.DMM.playbackState.tracks.length} tracks are playing.`);

  // 5. Kick off the first transition schedule.
  scheduleNextTransition();

  // This function will be called recursively to create the dynamic loop.
  function scheduleNextLoop() {
    // Evaluate conditions for each track
    window.DMM.playbackState.tracks.forEach(trackData => {
      // ... your existing logic to fade tracks in/out ...
    });

    // --- ADD THIS LINE ---
    // Broadcast that track states may have changed.
    Hooks.callAll("dmm.trackUpdate");

    // Schedule the next evaluation at the end of the current loop
    const loopTimer = setTimeout(scheduleNextLoop, song.duration);
    window.DMM.playbackState.timers.push(loopTimer);

    // Broadcast that the song has just looped, so the UI can update.
    Hooks.callAll("dmm.songLoop", window.DMM.playbackState.song);
  }

  // Start the first loop
  scheduleNextLoop();
}

/**
 * Schedules the two key moments for the next loop:
 * 1. The decision point (halfway through the loop).
 * 2. The fade execution point (just before the loop ends).
 */
function scheduleNextTransition() {
  const state = window.DMM.playbackState;
  if (!state) return;

  const songDuration = state.song.duration;
  const halfwayPoint = songDuration / 2;
  const fadeStartPoint = songDuration - (FADE_DURATION_MS / 2);

  // Clear any old timers before setting new ones
  state.timers.forEach(clearTimeout);
  state.timers = [];

  // a) Schedule the decision-making at the halfway point.
  const decisionTimer = setTimeout(() => {
    console.log(`DMM | [${state.song.name}] Mid-loop: Deciding next tracks...`);
    decideNextTracks();
  }, halfwayPoint);

  // b) Schedule the fade execution right before the loop ends.
  const fadeTimer = setTimeout(() => {
    console.log(`DMM | [${state.song.name}] Pre-loop: Executing fades...`);
    executeFades();
    // Once fades are done, immediately schedule the *next* loop's transition
    scheduleNextTransition();
  }, fadeStartPoint);

  state.timers.push(decisionTimer, fadeTimer);
}

/**
 * Decides which tracks should be audible in the next loop and stores the plan.
 * This function does NOT change any audio.
 */
function decideNextTracks() {
  const state = window.DMM.playbackState;
  if (!state) return;

  const { tracks, song } = state;
  const minLayers = Math.min(3, tracks.length);
  const maxLayers = tracks.length;
  const layerCount = Math.floor(Math.random() * (maxLayers - minLayers + 1)) + minLayers;

  // Get a shuffled list of all track sources and pick the winners
  const allTrackSrcs = tracks.map(t => t.src);
  const nextAudibleSrcs = allTrackSrcs.sort(() => 0.5 - Math.random()).slice(0, layerCount);

  // Store this plan in our state object for later use
  state.nextAudibleSrcs = nextAudibleSrcs;
  console.log(`DMM | Plan for next loop: ${nextAudibleSrcs.length} tracks.`, nextAudibleSrcs);
}

/**
 * Compares the current state to the planned state and executes fades.
 */
function executeFades() {
  const state = window.DMM.playbackState;
  if (!state || !state.nextAudibleSrcs) return;

  for (const track of state.tracks) {
    const shouldBeAudible = state.nextAudibleSrcs.includes(track.src);

    if (track.isAudible && !shouldBeAudible) {
      // It's on, but should be off. Fade it OUT.
      console.log(`DMM | Fading OUT: ${track.src}`);
      fadeWebAudio(track.sound, 1.0, 0.0, FADE_DURATION_MS);
      track.isAudible = false;
    } else if (!track.isAudible && shouldBeAudible) {
      // It's off, but should be on. Fade it IN.
      console.log(`DMM | Fading IN: ${track.src}`);
      fadeWebAudio(track.sound, 0.0, 1.0, FADE_DURATION_MS);
      track.isAudible = true;
    }
  }

  // --- MOVE THE HOOK CALL HERE ---
  // Broadcast that track states have changed.
  Hooks.callAll("dmm.trackUpdate");
}

/**
 * Stops all music and clears the state.
 */
function stopDynamicMusic() {
  if (!window.DMM.playbackState) return;

  console.log("DMM | Stopping all dynamic music...");

  const { tracks, timers } = window.DMM.playbackState;

  // Clear all scheduled events
  timers.forEach(clearTimeout);

  // Fade out and stop all sounds
  for (const track of tracks) {
    fadeWebAudio(track.sound, track.sound.volume, 0.0, FADE_DURATION_MS, () => {
      track.sound.stop();
    });
  }

  // Clear the state
  window.DMM.playbackState = null;
}

// You will need your fadeWebAudio function here as well.
function fadeWebAudio(sound, from, to, duration, onComplete) {
  const ctx = game.audio.context;
  if (!ctx) return;
  const now = ctx.currentTime;

  let gainParam = null;
  for (const key of Object.getOwnPropertyNames(sound)) {
    const prop = sound[key];
    if (prop && prop.gain instanceof AudioParam) {
      gainParam = prop.gain;
      break;
    }
  }
  if (!gainParam && sound.source?.gain instanceof AudioParam) {
    gainParam = sound.source.gain;
  }

  if (!gainParam) {
    console.warn("DMM | Could not find any AudioParam.gain on", sound);
    return onComplete?.();
  }

  gainParam.cancelScheduledValues(now);
  gainParam.setValueAtTime(from, now);
  gainParam.linearRampToValueAtTime(to, now + duration / 1000);

  if (typeof onComplete === "function") {
    setTimeout(onComplete, duration);
  }
}

