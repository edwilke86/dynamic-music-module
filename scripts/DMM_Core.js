/**
 * Dynamic Music Module - Core
 * Sets up the core module functionality
 */

// Initialize the main DMM object to be used across the module.
window.DMM = window.DMM || {};

// Shared constants
window.DMM.CONSTANTS = {
  FADE_DURATION_MS: 2000,
  MODULE_ID: "dynamic-music-module"
};

// Initialize state tracking
window.DMM.playbackState = null;

console.log("%cDynamic Music Module | Core Initialized", "color: #00ccff;");
