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

  /**
   * Prepares data for the UI template.
   */
  getData() {
    const data = super.getData();
    const currentPlayer = window.DMM.musicPlayer;

    data.songs = window.DMM.allSongs || [];
    data.intensityLevel = window.DMM.intensityLevel || 1;
    
    if (currentPlayer && currentPlayer.currentSong) {
      data.isCombatSongPlaying = currentPlayer.currentSong instanceof LayeredCombatSong;
    } else {
      data.isCombatSongPlaying = false;
    }

    return data;
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

    // --- Intensity Slider ---
    const intensityLabel = html.find("#dmm-intensity-label");

    // Helper function to update the label's color class
    const updateLabelColor = (level) => {
      intensityLabel.removeClass("dmm-intensity-1 dmm-intensity-2 dmm-intensity-3 dmm-intensity-4");
      intensityLabel.addClass(`dmm-intensity-${level}`);
    };

    // Set initial color
    updateLabelColor(window.DMM.intensityLevel);

    // Listener for slider changes
    html.on("input", "#dmm-intensity-slider", (event) => {
      const newIntensity = parseInt(event.currentTarget.value, 10);
      window.DMM.intensityLevel = newIntensity;
      
      // Update the label text and color
      intensityLabel.text(newIntensity);
      updateLabelColor(newIntensity);
      
      console.log(`The intensity level is now ${window.DMM.intensityLevel}`);
      
      // Call the update function if a combat song is playing
      if (window.DMM.playbackState && window.DMM.playbackState.song instanceof LayeredCombatSong) {
        window.DMM.updateCombatIntensity(newIntensity);
      }
    });

    // Register for update events
    Hooks.on("dmm.songUpdate", this._onSongUpdate);

    // Add listener for the new intensity buttons
    html.find('.intensity-btn').on('click', event => {
      const level = parseInt(event.currentTarget.dataset.level, 10);
      window.DMM.setIntensity(level);
    });
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