// Canonical order for the circle of fifths (major keys, clockwise)
const CIRCLE_OF_FIFTHS_MAJOR = [
  "C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F"
];

const CIRCLE_OF_FIFTHS_MINOR = [
  "a", "e", "b", "f#", "c#", "g#", "d#", "bb", "f", "c", "g", "d"
];

// Map for alternate names (enharmonic equivalents, modes, etc.)
const KEY_ALIASES = {
    "C": ["C", "C major"],
    "F": ["F", "F major"],
    "G": ["G", "G major"],
    "D": ["D", "D major"],
    "A": ["A", "A major"],
    "E": ["E", "E major"],
    "B": ["B", "B major"],
    "F#": ["F#", "F# major", "Gb", "Gb major"],
    "Db": ["Db", "Db major", "C#", "C# major"],
    "Ab": ["Ab", "Ab major", "G#", "G# major"],
    "Eb": ["Eb", "Eb major", "D#", "D# major"],
    "Bb": ["Bb", "Bb major", "A#", "A# major"],
    "a": ["a", "A minor"],
    "e": ["e", "E minor"],
    "b": ["b", "B minor"],
    "f#": ["f#", "F# minor", "gb", "Gb minor"],
    "c#": ["c#", "C# minor", "db", "Db minor"],
    "g#": ["g#", "G# minor", "ab", "Ab minor"],
    "d#": ["d#", "D# minor", "eb", "Eb minor"],
    "bb": ["bb", "Bb minor", "a#", "A# minor"],
    "f": ["f", "F minor", "e#", "E# minor"],
    "c": ["c", "C minor", "b#", "B# minor"],
    "g": ["g", "G minor", "f#", "F# minor"],
    "d": ["d", "D minor", "c#", "C# minor"]
};

// Meter aliases
const METER_ALIASES = {
  "C": "4/4",
  "Common": "4/4",
  "4/4": "4/4",
  "Cut": "2/2",
  "Cut Time": "2/2",
  "2/2": "2/2"
};

/**
 * Normalize a key signature to its canonical form.
 * @param {string} key
 * @returns {string}
 */
function normalizeKey(key) {
  // Handle modes (e.g., "C Dorian")
  if (key.includes(" ")) return key.trim();
  // Find canonical key
  for (const [canon, aliases] of Object.entries(KEY_ALIASES)) {
    if (aliases.includes(key)) return canon;
  }
  return key;
}

/**
 * Normalize a meter to its canonical form.
 * @param {string} meter
 * @returns {string}
 */
function normalizeMeter(meter) {
  return METER_ALIASES[meter] || meter;
}

/**
 * Get closely related keys for a given key.
 * @param {string} key - e.g. "C", "a", "C Dorian"
 * @returns {string[]} - Array of closely related keys
 */
function getCloselyRelatedKeys(key) {
  key = normalizeKey(key);

  // Allow for accidentals in major/minor keys
  const isMajor = /^[A-G][b#]?$/i.test(key) && key[0] === key[0].toUpperCase();
  const isMinor = /^[a-g][b#]?$/i.test(key) && key[0] === key[0].toLowerCase();

  let idx, circle;
  if (isMajor) {
    circle = CIRCLE_OF_FIFTHS_MAJOR;
    idx = circle.indexOf(key);
  } else if (isMinor) {
    circle = CIRCLE_OF_FIFTHS_MINOR;
    idx = circle.indexOf(key);
  } else {
    // For modes or other keys, just return the key itself for now
    return [key];
  }
  if (idx === -1) return [];

  // One step right and left
  const right = circle[(idx + 1) % circle.length];
  const left = circle[(idx - 1 + circle.length) % circle.length];

  // Relative minors/majors
  function relativeMinor(maj) {
    const rel = {
      "C": "a", "G": "e", "D": "b", "A": "f#", "E": "c#", "B": "g#", "F#": "d#", "Db": "bb", "Ab": "f", "Eb": "c", "Bb": "g", "F": "d"
    };
    return rel[maj] || "";
  }
  function relativeMajor(min) {
    const rel = {
      "a": "C", "e": "G", "b": "D", "f#": "A", "c#": "E", "g#": "B", "d#": "F#", "bb": "Db", "f": "Ab", "c": "Eb", "g": "Bb", "d": "F"
    };
    return rel[min] || "";
  }

  let related = [];
  if (isMajor) {
    related = [
      right, left,
      relativeMinor(key),
      relativeMinor(right),
      relativeMinor(left)
    ];
  } else if (isMinor) {
    related = [
      relativeMajor(key),
      relativeMajor(right),
      relativeMajor(left),
      right,
      left
    ];
    // Remove duplicates
    related = [...new Set(related)];
  }

  // Remove the original key from the list
  return related.filter(k => k !== key);
}

// Export for use elsewhere
window.DMM = window.DMM || {};
window.DMM.musicTheory = {
  normalizeKey,
  normalizeMeter,
  getCloselyRelatedKeys
};