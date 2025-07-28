/**
 * UI class for the Dynamic Music Module
 */

class DMM_UI extends Application {
  constructor(options = {}) {
    super(options);
    this._onSongUpdate = this._onSongUpdate.bind(this);
    console.log("%cDMM | DMM_UI constructor has been called!", "color: #00ccff;");
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "dmm-ui",
      title: "Dynamic Music Player",
      template: "modules/dynamic-music-module/templates/ui.html",
      width: 400,
      height: "auto",
      resizable: true,
      popOut: true,
      classes: ["dmm"],
      tabs: [{ navSelector: ".tabs", contentSelector: ".content", initial: "configure" }]
    });
  }

  getData() {
    const playbackState = window.DMM.playbackState;
    let nowPlayingData = null;

    if (playbackState && playbackState.song) {
      // Get information about currently playing tracks
      const audibleTracks = [];
      
      if (playbackState.tracks) {
        for (const track of playbackState.tracks) {
          if (track.isAudible) {
            // Get the current volume (rounded to percentage)
            const volume = track.sound ? Math.round(track.sound.volume * 100) : 0;
            audibleTracks.push({
              name: track.name,
              volume: volume
            });
          }
        }
      }

      nowPlayingData = {
        song: playbackState.song,
        audibleTracks: audibleTracks
      };
    }

    return {
      songs: window.DMM.songLibrary || [],
      nowPlaying: nowPlayingData
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Play button
    html.find("#dmm-play").on("click", async (ev) => {
      ev.preventDefault();
      if (game.audio.context.state === "suspended") {
        await game.audio.context.resume();
      }
      
      // Get the selected song from the dropdown
      let selectedSongName = html.find("#dmm-song-select").val();
      
      // Handle random song selection
      if (selectedSongName === "random") {
        const songs = window.DMM.songLibrary;
        if (songs && songs.length > 0) {
          const randomIndex = Math.floor(Math.random() * songs.length);
          selectedSongName = songs[randomIndex].name;
        } else {
          ui.notifications.warn("DMM | No songs in the library to choose from.");
          return;
        }
      }

      if (selectedSongName) {
        // Play the selected song
        await window.DMM.playDynamicSong(selectedSongName);
      }
    });

    // Stop button
    html.find("#dmm-stop").on("click", async (ev) => {
      ev.preventDefault();
      await window.DMM.stopAllMusic();
    });

    // Register for update events
    Hooks.on("dmm.songUpdate", this._onSongUpdate);
  }

  /**
   * Callback for when song information updates
   */
  _onSongUpdate() {
    // Only render if the window is actually open
    if (this._state > 0) { 
      this.render();
    }
  }

  async close(options) {
    // Remove listeners when window is closed
    Hooks.off("dmm.songUpdate", this._onSongUpdate);
    return super.close(options);
  }
}

window.DMM = window.DMM || {};
window.DMM.UI = DMM_UI;