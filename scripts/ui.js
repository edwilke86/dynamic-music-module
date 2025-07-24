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

    html.find("#dmm-play").on("click", (ev) => {
      ev.preventDefault();
      playRandomMusicLayers();
    });


    html.find("#dmm-stop").on("click", (event) => {
        event.preventDefault();
        stopDynamicMusic(); 
    });
  }
}
