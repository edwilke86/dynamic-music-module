const TRACKS = [
  "modules/dynamic-music-module/audio/Sylvan Stillness - Celli. Pizz.ogg",
  "modules/dynamic-music-module/audio/Sylvan Stillness - Harp.ogg",
  "modules/dynamic-music-module/audio/Sylvan Stillness - Horns.ogg",
  "modules/dynamic-music-module/audio/Sylvan Stillness - Pad.ogg",
  "modules/dynamic-music-module/audio/Sylvan Stillness - Vio. Section.ogg",
  "modules/dynamic-music-module/audio/Sylvan Stillness - Vio. Solo.ogg"

];

let currentHowls = [];
let LOOP_DURATION_MS = 78000; // 1:18 in milliseconds

function playLayeredLoop() {
  // Stop and unload previous sounds
  currentHowls.forEach(howl => howl.stop());
  currentHowls = [];

  // Pick 3 to 6 unique tracks randomly
  const shuffled = [...TRACKS].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.floor(Math.random() * 4) + 3); // 3 to 6

  console.log(`DMM | Playing layers:`, selected.map(s => s.split("/").pop()));

  // Create and play them in sync
  for (let path of selected) {
    let howl = new Howl({
      src: [path],
      volume: 1.0,
      loop: false, // We'll manually loop
      html5: false
    });
    howl.play();
    currentHowls.push(howl);
  }

  // Set timer for next switch
  setTimeout(playLayeredLoop, LOOP_DURATION_MS);
}

// Start playback when Foundry is ready
Hooks.once("ready", () => {
  console.log("%cDMM 🎵 READY", "color: lime; font-weight: bold;");
  playLayeredLoop();
});
