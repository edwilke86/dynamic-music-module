class DMM_UI extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "dmm-ui",
      title: "Dynamic Music Player",
      template: "modules/dynamic-music-module/templates/ui.html",
      width: 300,
      height: "auto",
      resizable: false
    });
  }

  activateListeners(html) {
  super.activateListeners(html);

  html.find("#dmm-play").on("click", async (ev) => {
    ev.preventDefault();

    // 1) Unlock the Web Audio context on that user click
    if ( game.audio.context.state === "suspended" ) {
      console.log("DMM ▶️ Resuming audio context");
      await game.audio.context.resume();
    }

    // 2) Now safely kick off your music loop
    playRandomMusicLayers();
  });

  html.find("#dmm-stop").on("click", (ev) => {
    ev.preventDefault();
    stopDynamicMusic(true);
  });
}

}
