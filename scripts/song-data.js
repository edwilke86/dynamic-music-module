/**
 * A single “layered song” with metadata.
 */
class LayeredSong {
  /**
   * @param {Object} opts
   * @param {string} opts.name      — A display name
   * @param {string[]} opts.tracks  — Array of relative paths
   * @param {string[]} opts.tags    — Genre/mood/location tags
   * @param {number} opts.duration  — Loop length in ms
   * @param {string} opts.key       — Musical key (e.g. “D”)
   * @param {string} opts.meter     — Time signature (e.g. “4/4”)
   * @param {string} opts.tempo     — Tempo in BPM (e.g. “120”)
   */
  constructor({ name, tracks, tags, duration, key, meter, tempo }) {
    this.name     = name;
    this.tracks   = tracks;
    this.tags     = tags;
    this.duration = duration;
    this.key      = key;
    this.meter    = meter;
    this.tempo    = tempo; // Default tempo in BPM
  }
}

// Song Library
// This is a collection of LayeredSong instances, each representing a unique song.
// You can add more songs by creating new LayeredSong instances and adding them to this array.
// Each song can have multiple tracks, tags for filtering, and metadata like duration, key, 
// and meter.


window.DMM = window.DMM || {};
window.DMM.songLibrary = [
  new LayeredSong({
    name:    "Sylvan Stillness",
    tracks:  [
      "audio/Sylvan Stillness/Celli. Pizz.ogg",
      "audio/Sylvan Stillness/Harp.ogg",
      "audio/Sylvan Stillness/Horns.ogg",
      "audio/Sylvan Stillness/Pad.ogg",
      "audio/Sylvan Stillness/Vio. Section.ogg",
      "audio/Sylvan Stillness/Vio. Solo.ogg"
    ],
    tags:     ["fantasy","peaceful","forest","ambiance","pretty"],
    duration: 78000,   // 1m18s
    key:      "D",
    meter:    "4/4",
    tempo:    70
  }),

  new LayeredSong({
    name:    "Gnomish Playground",
    tracks: [
        "audio/Gnomish Playground/Cello.ogg",
        "audio/Gnomish Playground/Flute.ogg",
        "audio/Gnomish Playground/Double Bass.ogg",
        "audio/Gnomish Playground/Tenor Trombone.ogg",
        "audio/Gnomish Playground/Tuba.ogg",
        "audio/Gnomish Playground/Vio. I.ogg",
        "audio/Gnomish Playground/Vio. II.ogg",
        "audio/Gnomish Playground/Viola.ogg"
    ],
    tags:     ["fantasy","playful","gnome","ambiance","happy"],
    duration: 19200,   // 19.200s
    key:      "C",
    meter:    "4/4",
    tempo:    100
  }),
  // … add more LayeredSong instances here …
];
