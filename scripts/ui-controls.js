/**
 * UI Controls for Dynamic Music Module
 * This file is now deprecated as UI logic has been moved to ui.js
 */

window.DMM = window.DMM || {};

// All logic has been moved to DMM_UI in ui.js to resolve event listener conflicts.
// This file can be removed.

console.log("%cDynamic Music Module | ui-controls.js is deprecated.", "color: #ff8c00;");

class DMM_UIControls {
  static initialize() {
    // Set default intensity
    window.DMM.intensityLevel = 1;

    // Hook into the main module UI render to add listeners
    // NOTE: Replace "renderMyModuleUI" with the actual render hook for your UI
    Hooks.on("renderApplication", (app, html, data) => {
      // Only act on our module's UI
      if (!html.find("#dmm-intensity-slider").length) return;
      
      this.activateListeners(html);
    });

    console.log("%cDynamic Music Module | UI Controls Initialized", "color: #00ccff;");
  }

  /**
   * Activates event listeners for the intensity slider.
   * @param {jQuery} html - The jQuery object for the UI's HTML.
   */
  static activateListeners(html) {
    const slider = html.find("#dmm-intensity-slider");
    const label = html.find("#dmm-intensity-label");

    // Set initial values from our global state
    slider.val(window.DMM.intensityLevel);
    label.text(window.DMM.intensityLevel);

    // Use event delegation on the parent html element
    html.on("input", "#dmm-intensity-slider", (event) => {
      const newIntensity = parseInt(event.currentTarget.value, 10);
      window.DMM.intensityLevel = newIntensity;
      
      // Update the label next to the slider
      html.find("#dmm-intensity-label").text(newIntensity);
      
      console.log(`The intensity level is now ${window.DMM.intensityLevel}`);
      
      // Call the update function if a combat song is playing
      if (window.DMM.playbackState && window.DMM.playbackState.song instanceof LayeredCombatSong) {
        window.DMM.updateCombatIntensity(newIntensity);
      }
    });
  }
}

// Initialize controls on startup
DMM_UIControls.initialize();
