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
      "Sylvan Stillness - Celli. Pizz.ogg",
      "Sylvan Stillness - Harp.ogg",
      "Sylvan Stillness - Horns.ogg",
      "Sylvan Stillness - Pad.ogg",
      "Sylvan Stillness - Vio. Section.ogg",
      "Sylvan Stillness - Vio. Solo.ogg"
    ],
    tags:     ["fantasy","peaceful","forest","ambiance","pretty"],
    duration: 78000,   // 1m18s
    key:      "D",
    meter:    "4/4"
  }),

  new LayeredSong({
    name:    "Gnomish Playground",
    tracks: [
        "Gnomish Playground/Gnomish Playground - 01 Start - Cello.ogg",
        "Gnomish Playground/Gnomish Playground - 01 Start - Double Bass.ogg",
        "Gnomish Playground/Gnomish Playground - 01 Start - St.1(2).ogg",
        "Gnomish Playground/Gnomish Playground - 01 Start - St.1(3).ogg",
        "Gnomish Playground/Gnomish Playground - 01 Start - St.1(4).ogg",
        "Gnomish Playground/Gnomish Playground - 01 Start - St.1(5).ogg",
        "Gnomish Playground/Gnomish Playground - 01 Start - St.1(6).ogg",
        "Gnomish Playground/Gnomish Playground - 01 Start - St.1.ogg",
        "Gnomish Playground/Gnomish Playground - 01 Start - T. Trom.ogg",
        "Gnomish Playground/Gnomish Playground - 01 Start - Viola.ogg"
    ],
    tags:     ["fantasy","playful","gnome","ambiance","happy"],
    duration: 19000,   // 19s
    key:      "C",
    meter:    "4/4",
    tempo:    100
  }),
  // … add more LayeredSong instances here …
];
