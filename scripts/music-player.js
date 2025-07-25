window.DMM                          = window.DMM || {};
window.DMM.currentDmmSounds         = [];
let dmmLoopTimeout                  = null;
const FADE_DURATION_MS              = 2000;
const FADE_STEPS                    = 40; 
const FADE_INTERVAL_MS              = FADE_DURATION_MS / FADE_STEPS;
const basePath                      = "modules/dynamic-music-module/audio/";

/**
 * Fade a Foundry Sound’s GainNode from `from`→`to` over `duration` ms.
 * @param {Sound} sound    A Foundry Sound instance
 * @param {number} from    Starting volume (0…1)
 * @param {number} to      Ending volume (0…1)
 * @param {number} duration Fade time in milliseconds
 * @param {Function} onComplete  Called after fade finishes
 */

/**
 * Attempt to locate the AudioParam used for volume on a Foundry Sound,
 * then ramp it from `from`→`to` over `duration`ms.
 */
function fadeWebAudio(sound, from, to, duration, onComplete) {
  const ctx = game.audio.context;
  const now = ctx.currentTime;

  // 1) Find an object on `sound` that has a `.gain` AudioParam
  let gainParam = null;
  for (const key of Object.getOwnPropertyNames(sound)) {
    const prop = sound[key];
    if (prop && prop.gain instanceof AudioParam) {
      gainParam = prop.gain;
      break;
    }
  }
  // 2) Fallback: maybe sound.source has it
  if (!gainParam && sound.source?.gain instanceof AudioParam) {
    gainParam = sound.source.gain;
  }

  if (!gainParam) {
    console.warn("DMM | Could not find any AudioParam.gain on", sound);
    return onComplete?.();
  }

  // 3) Cancel any scheduled ramps and set start value
  gainParam.cancelScheduledValues(now);
  gainParam.setValueAtTime(from, now);

  // 4) Schedule a linear ramp to target
  gainParam.linearRampToValueAtTime(to, now + duration / 1000);

  // 5) After the fade finishes, call onComplete
  if (typeof onComplete === "function") {
    setTimeout(onComplete, duration);
  }
}



async function playRandomMusicLayers() {
  // 1) Stop any existing loop
  stopDynamicMusic(true);

  // 2) Choose a song (you could also filter by tags here)
  const songs = window.DMM.songLibrary;
  const song  = songs[Math.floor(Math.random() * songs.length)];
  console.log(`DMM Playing Now playing “${song.name}” [${song.key} ${song.meter}]`);

  // 3) Randomly pick 3–6 tracks from that song
  const layerCount = Math.floor(Math.random() * 4) + 3;
  const selected   = song.tracks.sort(() => 0.5 - Math.random()).slice(0, layerCount);
  console.log("DMM Playing Selected layers:", selected);

  // awaiting the Sound before fading it in
 window.DMM.currentDmmSounds = [];

  // 5) Create & play each sound explicitly
  for (const file of selected) {
    // Use create() so we get back the Sound instance
    const snd = await foundry.audio.AudioHelper.play({
      src:      basePath + file,
      loop:     true,
      volume:   0,       // start muted for fade-in
      autoplay: true,     // we'll call play() ourselves
    });
    if (!snd) continue;

    // Start it for real:
    snd.play();

    // Now fade from 0→1
    fadeWebAudio(snd, 0.0, 1.0, FADE_DURATION_MS);

    // Track it so we can stop it later
    window.DMM.currentDmmSounds.push(snd);
  }

  // 6) Schedule next loop
  dmmLoopTimeout = setTimeout(playRandomMusicLayers, song.duration);
}



function stopDynamicMusic(fadeOut = false) {
  if (dmmLoopTimeout) {
    clearTimeout(dmmLoopTimeout);
    dmmLoopTimeout = null;
  }

  if (fadeOut) {
    for (const snd of window.DMM.currentDmmSounds) {
      // snd is now a real Sound, so fadeWebAudio will find its gain param
      fadeWebAudio(snd, 1.0, 0.0, FADE_DURATION_MS, () => snd.stop());
    }
  } else {
    for (const snd of window.DMM.currentDmmSounds) {
      snd.stop();
    }
  }


  window.DMM.currentDmmSounds = [];
  console.log("DMM | Playback stopped" + (fadeOut ? " with fade" : ""));
}

