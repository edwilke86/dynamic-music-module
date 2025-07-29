# Dynamic Music Module (DMM) for Foundry VTT

**Code & Scripting by:** Neo Shain  
**Original Music by:** Dallas Scott Wilke  
**Version:** 0.3.0  
**System Compatibility:** Foundry VTT v13+  
**Status:** In development (Private)

> 🧑‍🎤 *Note: Neo Shain and Dallas Scott Wilke are the same person.*  
> Neo Shain is the creative alias used for game development and scripting.  
> Dallas Scott Wilke is credited for all musical composition and scoring.

---

## 🎧 What is DMM?

The **Dynamic Music Module** brings a dynamic, immersive soundtrack system to Foundry VTT. Designed to respond to in-game events, DMM intelligently adjusts music in real-time—transitioning seamlessly between tracks based on:

- 🎭 Emotional tone
- ⚔️ Combat status and intensity levels
- ❤️ Party health
- ☠️ Enemy types (bosses, mobs, etc.)
- 📍 Scene location or tag
- 📘 Narrative beats or custom triggers

---

## ✅ Current Features

- **Layered Music System**: Multiple audio tracks play simultaneously with dynamic mixing
- **Combat Intensity Tracking**: 4-level intensity system (1-4) that responds to combat events
- **Dynamic Track Mixing**: Real-time fade-in/out of tracks during playback with randomized volumes
- **Layered Combat Songs**: Specialized combat music with intensity-based track selection
- **Tag-based Music Management**: Organize and trigger music using custom tags
- **Custom Music Stem Support**: Support for layered ambient + rhythmic tracks
- **Playlist Integration**: Import and manage music through Foundry's native playlist system
- **Real-time UI Controls**: Monitor and control playback with live track visualization
- **Music Theory Helpers**: Built-in functions for key relationships and transitions
- **Seamless Transitions**: Crossfading between different musical states
- **Automatic Combat Integration**: Music automatically changes when combat starts/ends
- **Mid-loop Randomization**: Tracks are randomly mixed halfway through each loop for variety

---

## 🔧 Planned Features

- **Enhanced Event Logic**: More sophisticated triggers based on party health, enemy types
- **GM Override Controls**: Manual track queuing and mood overrides
- **Preset Mood Libraries**: Pre-configured settings for *tense, eerie, hopeful, triumphant*
- **Scene-based Auto-triggering**: Automatic music selection based on scene tags
- **Advanced Transition Rules**: Custom fade timings and transition behaviors

---

## 📁 File Structure

```bash
dynamic-music-module/
├── module.json
├── README.md
├── LICENSE (coming soon)
├── .gitignore
├── scripts/
│   ├── main.js
│   ├── music-player.js
│   ├── song-library.js
│   ├── ui-controls.js
│   └── combat-integration.js
├── styles/
│   └── style.css
├── music/
│   └── (your .wav/.mp3 loops here)
└── templates/
    └── music-controls.html
```

## 📜 License

This module and all associated files are proprietary.

- All code and module logic © Neo Shain
- All original music and sound assets © Dallas Scott Wilke

Redistribution, modification, or commercial use is prohibited without express written permission.
A full commercial license and EULA will be provided in future releases.

## 📬 Contact

For licensing inquiries, questions, or support, please contact:
**Dallas Scott Wilke (Neo Shain)**
📧 [edwilke86@gmail.com](mailto:edwilke86@gmail.com)

## 🚧 Development Roadmap

- Basic tag system ✓
- Music trigger hook for combat ✓
- Config UI for music libraries ✓
- Event-aware transition logic
- Packaging for release
