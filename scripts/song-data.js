/**
 * A single "layered song" with metadata.
 */
class LayeredSong {
  /**
   * @param {Object} opts
   * @param {string} opts.name      — A display name
   * @param {string[]} opts.tracks  — Array of relative paths
   * @param {string[]} opts.tags    — Genre/mood/location tags
   * @param {number} opts.duration  — Loop length in ms
   * @param {string} opts.key       — Musical key (e.g. "D")
   * @param {string} opts.meter     — Time signature (e.g. "4/4")
   * @param {string} opts.tempo     — Tempo in BPM (e.g. "120")
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

/**
 * A transition audio segment for smooth changes between LayeredSongs.
 */
class Transition {
  /**
   * @param {Object} opts
   * @param {string} opts.name         — Display name
   * @param {string} opts.track        — Path to the audio file
   * @param {number} opts.duration     — Length in ms (required)
   * @param {string[]} opts.startTags  — Tags describing the starting mood/scene
   * @param {string[]} [opts.endTags]  — Tags describing the ending mood/scene (optional)
   * @param {string} opts.startKey     — Starting musical key
   * @param {string} [opts.endKey]     — Ending musical key (optional)
   * @param {string} opts.startMeter   — Starting meter
   * @param {string} [opts.endMeter]   — Ending meter (optional)
   * @param {number} opts.startTempo   — Starting tempo (BPM)
   * @param {number} [opts.endTempo]   — Ending tempo (BPM, optional)
   */
  constructor({
    name,
    track,
    duration,
    startTags,
    endTags,
    startKey,
    endKey,
    startMeter,
    endMeter,
    startTempo,
    endTempo
  }) {
    this.name = name;
    this.track = track;
    this.duration = duration;
    this.startTags = startTags;
    this.endTags = endTags ?? startTags;
    this.startKey = startKey;
    this.endKey = endKey ?? startKey;
    this.startMeter = startMeter;
    this.endMeter = endMeter ?? startMeter;
    this.startTempo = startTempo;
    this.endTempo = endTempo ?? startTempo;
  }
}

/**
 * A layered song specifically for combat, with intensity-based tracks.
 */
class LayeredCombatSong extends LayeredSong {
  /**
   * @param {Object} opts
   * @param {string} opts.name      — A display name
   * @param {Array<{path: string, intensity: number}>} opts.tracks - Array of track objects with intensity levels
   * @param {string[]} opts.tags    — Genre/mood/location tags
   * @param {number} opts.duration  — Loop length in ms
   * @param {string} opts.key       — Musical key (e.g. "D")
   * @param {string} opts.meter     — Time signature (e.g. "4/4")
   * @param {string} opts.tempo     — Tempo in BPM (e.g. "120")
   */
  constructor({ name, tracks, tags, duration, key, meter, tempo }) {
    // Pass all but tracks up to the parent LayeredSong constructor
    super({ name, tracks: [], tags, duration, key, meter, tempo });
    // Override tracks with the new format
    this.tracks = tracks;
  }

  /**
   * Gets all track paths for a given intensity level or lower.
   * @param {number} level - The current intensity level (1-4)
   * @returns {string[]} An array of track paths to play.
   */
  getTracksForIntensity(level) {
    return this.tracks
      .filter(track => track.intensity <= level)
      .map(track => track.path);
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
    tags:     ["fantasy","playful","gnome","ambiance","happy","peaceful"],
    duration: 19200,   // 19.200s
    key:      "C",
    meter:    "4/4",
    tempo:    100
  }),

  // "The First Battle" has been moved to the combat library below.
];

// Combat Song Library
window.DMM.combatSongLibrary = [
  new LayeredCombatSong({
    name:    "The First Battle",
    tracks:  [
      // Intensity 1: The core rhythm and foundation
      { path: "audio/The First Battle/Double Bass.ogg", intensity: 1 },
      { path: "audio/The First Battle/Tbones.ogg", intensity: 1 },
      { path: "audio/The First Battle/Bassoon.ogg", intensity: 1 },
      // Intensity 2: Main melodic and harmonic content
      { path: "audio/The First Battle/Timpani.ogg", intensity: 2 },
      { path: "audio/The First Battle/Violins.ogg", intensity: 2 },
      { path: "audio/The First Battle/Tuba.ogg", intensity: 2 },
      // Intensity 3: More powerful elements and percussion
      { path: "audio/The First Battle/Horn Layer One.ogg", intensity: 3 },
      { path: "audio/The First Battle/Cello.ogg", intensity: 3 },
      // Intensity 4: Dramatic flourishes for the climax
      { path: "audio/The First Battle/Gong.ogg", intensity: 4 },
      { path: "audio/The First Battle/Oboe.ogg", intensity: 4 }
    ],
    tags:     ["intense","combat","orchestra","fight","boss"],
    duration: 153600,   // 2m33s
    key:      "a",
    meter:    "4/4",
    tempo:    100
  }),
];

// Combined library for easier lookups
window.DMM.allSongs = [
  ...(window.DMM.songLibrary || []),
  ...(window.DMM.combatSongLibrary || [])
];


// Transitions
window.DMM.transitionLibrary = [
  new Transition({
    name: "C to Amin - String Quartet",
    track: "audio/Transitions/01 Start/C to Amin - String Quartet.ogg",
    duration: 9600,   // 9.6s
    startTags: ["strings", "general", "transition" ],
    startKey: "C",
    endKey: "a",
    startMeter: "4/4",
    startTempo: 100
  })
];

console.log("%cDynamic Music Module | Song Library Initialized", "color: #00ccff;");