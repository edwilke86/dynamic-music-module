window.DMM = window.DMM || {};
window.DMM.currentDmmSounds = [];
let dmmInterval = null;

async function playRandomMusicLayers() {
  // Stop any old sounds/timers
  stopDynamicMusic();

  const basePath = "modules/dynamic-music-module/audio/";
  const files = [
    "Sylvan Stillness - Celli. Pizz.ogg",
    "Sylvan Stillness - Harp.ogg",
    "Sylvan Stillness - Horns.ogg",
    "Sylvan Stillness - Pad.ogg",
    "Sylvan Stillness - Vio. Section.ogg",
    "Sylvan Stillness - Vio. Solo.ogg"
  ];
  const layerCount = Math.floor(Math.random() * 4) + 3; // 3–6
  const selected = files.sort(() => 0.5 - Math.random()).slice(0, layerCount);

  console.log("DMM | Playing layers:", selected);

  // Create & play each via AudioHelper
  for (const file of selected) {
    try {
      const sound = await foundry.audio.AudioHelper.play({
        src: basePath + file,
        autoplay: true,
        volume: 1.0,
        loop: false
      }, true);
      if (!sound) {
        console.warn(`DMM | Failed to play sound: ${file}`);
        continue;
      }
      window.DMM.currentDmmSounds.push(sound);
    } catch (err) {
      console.warn(`DMM | Error playing sound: ${file}`, err);
    }
  }

  // Queue the next run
  dmmInterval = setTimeout(playRandomMusicLayers, 78000);
}

function stopDynamicMusic() {
  // Stop all tracked sounds
  for (const snd of window.DMM.currentDmmSounds) {
    if (snd && typeof snd.stop === "function") snd.stop();
  }
  window.DMM.currentDmmSounds = [];

  // Clear the timer
  if (dmmInterval !== null) {
    clearTimeout(dmmInterval);
    dmmInterval = null;
  }

  console.log("DMM | Playback stopped.");
}
