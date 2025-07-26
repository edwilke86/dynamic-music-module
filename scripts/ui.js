class DMM_UI extends Application {
  constructor(options = {}) {
    super(options);
    // Bind the listener method to this instance to ensure correct `this` context
    // and to allow us to unregister the exact same function on close.
    this._onSongLoop = this._onSongLoop.bind(this);
    console.log("DMM | DMM_UI constructor has been called!");
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "dmm-ui",
      title: "Dynamic Music Player",
      template: "modules/dynamic-music-module/templates/ui.html",
      width: 400,
      height: "auto", // Let height be determined by content
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
      const audibleTracks = playbackState.tracks
        .filter(t => t.isAudible)
        .map(t => t.src.split('/').pop()); // Just get the filename

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

    html.find("#dmm-play").on("click", async (ev) => {
      ev.preventDefault();
      if (game.audio.context.state === "suspended") {
        await game.audio.context.resume();
      }
      let selectedSongName = html.find("#dmm-song-select").val();
      
      if (selectedSongName === "random") {
        const songs = window.DMM.songLibrary;
        if (songs && songs.length > 0) {
          const randomSong = songs[Math.floor(Math.random() * songs.length)];
          selectedSongName = randomSong.name;
        } else {
          ui.notifications.warn("DMM | No songs in the library to choose from.");
          return;
        }
      }

      if (selectedSongName) {
        playDynamicSong(selectedSongName);
      }
    });

    html.find("#dmm-stop").on("click", (ev) => {
      ev.preventDefault();
      stopDynamicMusic();
    });

    // Listen for the custom hooks from the music player
    Hooks.on("dmm.songLoop", this._onSongLoop);
    Hooks.on("dmm.trackUpdate", this._onSongLoop); // Add listener for the new hook
  }

  /**
   * A callback function that fires when the song loops or tracks update.
   */
  _onSongLoop() {
    // Only render if the window is actually open
    if (this._state > 0) { 
      this.render();
    }
  }

  async close(options) {
    // Important: turn off the hook listeners when the window is closed to prevent memory leaks.
    Hooks.off("dmm.songLoop", this._onSongLoop);
    Hooks.off("dmm.trackUpdate", this._onSongLoop); // Add this line
    return super.close(options);
  }
}