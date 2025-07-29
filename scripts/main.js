/**
 * Dynamic Music Module
 * Author: Neo Shain
 * Original Music: Dallas Scott Wilke
 */

Hooks.once("init", () => {
  console.log("%cDynamic Music Module | Initializing...", "color: #00ccff;");
});

Hooks.once("ready", async () => {
  const banner = `
██████╗ ███╗   ███╗███╗   ███╗
██╔══██╗████╗ ████║████╗ ████║
██║  ██║██╔████╔██║██╔████╔██║
██║  ██║██║╚██╔╝██║██║╚██╔╝██║
██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║
╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝
        🎵 DYNAMIC MUSIC MODULE READY 🎵`;

  console.log(`%c${banner}`, "color: #00ccff; font-weight: bold; font-family: monospace;");

  // Import songs into playlists automatically on every load
  await window.DMM.importSongsAsPlaylists();
  console.log("%cDynamic Music Module | Verified and/or created playlists.", "color: #00ccff;");

  // Configure playlist modes on game load
  await configurePlaylistModes();

  // Set up global DMM state
  window.DMM.intensityLevel = 1;
  window.DMM.setIntensity = (level) => {
    console.log(`DMM: Setting combat intensity to ${level}`);
    window.DMM.intensityLevel = level;
    // If a combat song is playing, tell the player to update its volumes
    if (window.DMM.musicPlayer?.currentSong instanceof LayeredCombatSong) {
      window.DMM.musicPlayer.updateTrackVolumes();
    }
    // Re-render the UI to show the active button
    window.DMM.app.render();
  };

  // Initialize the combat transition system
  window.DMM.combatTransitioner = new CombatMusicTransitioner(window.DMM);
  console.log("%cDynamic Music Module | Combat music system initialized.", "color: #00ccff;");

  // Render the UI
  new window.DMM.UI().render(true);
  console.log("%cDynamic Music Module | UI rendered.", "color: #00ccff;");
});

/**
 * Sets the correct playback mode for DMM playlists on startup.
 */
async function configurePlaylistModes() {
  console.log("DMM: Configuring playlist modes on startup...");

  const allSongs = window.DMM.allSongs || [];
  const transitionLibrary = window.DMM.transitionLibrary || [];

  for (const playlist of game.playlists.contents) {
    // Check if the playlist is a Layered Song (combat or peaceful)
    const isLayeredSong = allSongs.some(s => s.name === playlist.name);
    if (isLayeredSong) {
      if (playlist.mode !== CONST.PLAYLIST_MODES.SIMULTANEOUS) {
        console.log(`DMM: Setting playlist "${playlist.name}" to SIMULTANEOUS mode.`);
        await playlist.update({ mode: CONST.PLAYLIST_MODES.SIMULTANEOUS });
      }
      continue; // Move to the next playlist
    }

    // Check if the playlist contains a Transition sound
    if (playlist.sounds?.contents) {
      const containsTransition = playlist.sounds.contents.some(sound => 
        transitionLibrary.some(t => t.name === sound.name)
      );

      if (containsTransition) {
        if (playlist.mode !== CONST.PLAYLIST_MODES.DISABLED) {
          console.log(`DMM: Setting playlist "${playlist.name}" to DISABLED (Soundboard) mode.`);
          await playlist.update({ mode: CONST.PLAYLIST_MODES.DISABLED });
        }
      }
    }
  }
  console.log("DMM: Playlist modes configured.");
}

// Combat Music Transition System
class CombatMusicTransitioner {
  constructor(dmm) {
    this.dmm = dmm;
    this.registerHooks();
    this.transitionTrackPlaying = false;
    
    // Updated track names to match what's in the playlists (based on the screenshot)
    this.peacefulTrack = "Gnomish Playground";
    this.combatTrack = "The First Battle";
    this.transitionTrack = "C to Amin - String Quartet"; // Fixed name with hyphen
    
    // Transition timing in ms
    this.fadeOutTime = 2000;
    this.fadeInTime = 2000;
    
    // Get the transition duration from the song data library instead of hardcoding it
    const transitionData = window.DMM.transitionLibrary.find(t => t.name === this.transitionTrack);
    this.transitionDuration = transitionData ? transitionData.duration : 10000; // Fallback to 10s
    console.log(`DMM | Transition duration for "${this.transitionTrack}" set to ${this.transitionDuration}ms`);
  }
  
  registerHooks() {
    // Hook into combat start/end events
    // We only need to listen to combatStart, as updateCombat was causing a double-fire.
    Hooks.on("combatStart", (combat) => {
      console.log("DMM: Combat start event triggered");
      this.handleCombatStartOnce();
    });
    
    Hooks.on("combatEnd", (combat) => {
      // This is the primary hook for ending combat.
      console.log("DMM: 'combatEnd' hook triggered. Transitioning music.");
      this.handleCombatEnd();
    });
    
    // The updateCombat hook is a fallback for systems that might not fire combatEnd reliably.
    Hooks.on("updateCombat", (combat, updateData, options, userId) => {
      // A combat encounter has ended if the round is updated to 0 or null.
      if (combat.previous?.round > 0 && (updateData.round === 0 || updateData.round === null)) {
        console.log("DMM: 'updateCombat' hook detected combat ending. Transitioning music.");
        this.handleCombatEnd();
      }
    });
  }
  
  handleCombatStart() {
    try {
      // Gracefully crossfade from peaceful to the transition track.
      console.log("DMM: Crossfading from peaceful to transition...");

      // 1. Find and fade out the peaceful track(s).
      const peacefulPlaylist = game.playlists.contents.find(p => p.name === this.peacefulTrack);
      if (peacefulPlaylist && peacefulPlaylist.playing) {
        for (const sound of peacefulPlaylist.sounds.contents) {
          // The .sound property is the actual playing audio object that has the fade method.
          if (sound.playing && sound.sound) {
            sound.sound.fade(0, { duration: this.fadeOutTime });
          }
        }
        // After fade out is complete, stop the playlist entirely.
        setTimeout(() => {
          if (peacefulPlaylist.playing) peacefulPlaylist.stopAll();
        }, this.fadeOutTime);
      }

      // 2. Find and play the link track with a fade-in.
      let linkSoundDoc;
      for (const p of game.playlists.contents) {
        if (!p.sounds?.contents) continue;
        const s = p.sounds.contents.find(sound => sound.name === this.transitionTrack);
        if (s) {
          linkSoundDoc = s;
          break;
        }
      }

      if (linkSoundDoc) {
        // To fade in, we play the sound and then immediately call fade on its .sound property.
        linkSoundDoc.parent.playSound(linkSoundDoc);
        
        // We need to wait a brief moment for the .sound object to be created.
        setTimeout(() => {
          if (linkSoundDoc.sound) {
            linkSoundDoc.sound.fade(1.0, { duration: this.fadeInTime });
          }
        }, 50); // 50ms should be enough time.
        
      } else {
        console.log(`DMM: Could not find link track "${this.transitionTrack}" to play.`);
      }
      
      // 3. Preload the combat music in the background while the transition plays.
      const combatPlaylist = game.playlists.contents.find(p => p.name === this.combatTrack);
      if (combatPlaylist) {
        console.log(`DMM: Preloading combat playlist: ${this.combatTrack}`);
        try {
          for (const sound of combatPlaylist.sounds.contents) {
            game.audio.preload(sound.path);
          }
          console.log(`DMM: Combat playlist "${this.combatTrack}" preloaded successfully.`);
        } catch (err) {
          console.error(`DMM: Error preloading combat playlist.`, err);
        }
      }

      // After transition completes, hard cut to the combat track.
      setTimeout(() => {
        console.log(`DMM: Playing combat track: ${this.combatTrack}`);
        window.DMM.playDynamicSong(this.combatTrack);
      }, this.transitionDuration);
    } catch (e) {
      console.error("DMM: Error during combat music transition:", e);
      this.transitionTrackPlaying = false; // Reset flag on error
    }
  }
  
  handleCombatEnd() {
    try {
      // Directly transition back to peaceful music
      console.log(`DMM: Returning to peaceful track: ${this.peacefulTrack}`);
      
      // Forcefully stop all currently playing music
      console.log("DMM: Stopping all current music...");
      if (this.dmm.musicPlayer) {
        this.dmm.musicPlayer.stopCurrentTrack();
      }
      for (const p of game.playlists.contents) {
        if (p.playing) {
          p.stopAll();
        }
      }
      
      // Play peaceful track
      window.DMM.playDynamicSong(this.peacefulTrack);
    } catch (e) {
      console.error("DMM: Error during combat end music transition:", e);
    }
  }
  
  /* This method can be removed.
  playTrack(trackName, loop = true) {
    try {
      console.log(`DMM: Attempting to play track "${trackName}"`);

      // Check if this is a known Layered Song or Transition from our libraries
      const isLayeredSong = window.DMM.allSongs.some(s => s.name === trackName);
      const isTransition = window.DMM.transitionLibrary.some(t => t.name === trackName);

      // First, check if there's a playlist with this exact name. This handles "The First Battle".
      const directPlaylist = game.playlists.contents.find(p => p.name === trackName);
      if (directPlaylist) {
        console.log(`DMM: Found playlist named "${trackName}". Playing it.`);
        directPlaylist.playAll();
        return;
      }

      // If no direct playlist match, search for a sound within any playlist.
      for (const playlist of game.playlists.contents) {
        if (!playlist.sounds?.contents) continue;
        
        const sound = playlist.sounds.contents.find(s => 
          s.name === trackName || s.name.includes(trackName)
        );
        
        if (sound) {
          console.log(`DMM: Found sound "${trackName}" in playlist "${playlist.name}". Playing it.`);
          
          // Play the specific sound.
          playlist.playSound(sound);
          // The loop parameter is passed to the sound itself.
          sound.update({ playing: true, loop: loop, volume: 1.0 });
          return;
        }
      }
      
      console.log(`DMM: Could not find any playlist or sound matching "${trackName}"`);
    } catch (e) {
      console.error(`\nDMM: Error playing track "${trackName}":`, e);
    }
  }
  */
  
  // Add a method to prevent duplicate event handling
  handleCombatStartOnce() {
    // Only process if we're not already transitioning
    if (this.transitionTrackPlaying) return;
    
    this.transitionTrackPlaying = true;
    this.handleCombatStart();
    
    // Reset flag after transition completes
    setTimeout(() => {
      this.transitionTrackPlaying = false;
    }, this.transitionDuration + 500);
  }
}

// Remove the duplicate initialization hook at the end of the file
// The initialization is now properly handled in the main ready hook