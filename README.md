# Dynamic Music Module (DMM) for Foundry VTT

**Code & Scripting by:** Neo Shain  
**Original Music by:** Dallas Scott Wilke  
**Version:** 0.2.0  
**System Compatibility:** Foundry VTT v13+  
**Status:** In development (Private)

> 🧑‍🎤 *Note: Neo Shain and Dallas Scott Wilke are the same person.*  
> Neo Shain is the creative alias used for game development and scripting.  
> Dallas Scott Wilke is credited for all musical composition and scoring.

---

## 🎧 What is DMM?

The **Dynamic Music Module** brings a dynamic, immersive soundtrack system to Foundry VTT. Designed to respond to in-game events, DMM intelligently adjusts music in real-time—transitioning seamlessly between tracks based on:

- 🎭 Emotional tone
- ⚔️ Combat status
- ❤️ Party health
- ☠️ Enemy types (bosses, mobs, etc.)
- 📍 Scene location or tag
- 📘 Narrative beats or custom triggers

---

## ✅ Current Features

- Functional layered music playback system
- Dynamic track mixing with fade-in/out during playback
- Tag-based music loop management system
- Custom music stem support (layered ambient + rhythmic tracks)
- Song data management with tags
- Playlist importing functionality
- UI for controlling and monitoring playback
- Music theory helper functions
- Transition logic with crossfading

---

## 🔧 Planned Features

- Auto-detection of combat start/end
- Optional GM controls for overriding or queuing tracks
- Preset libraries for moods like *tense, eerie, hopeful, triumphant*
- Enhanced event-aware transition logic

---

## 📁 File Structure

```bash
dynamic-music-module/
├── module.json
├── README.md
├── LICENSE (coming soon)
├── .gitignore
├── scripts/
│   └── main.js
├── styles/
│   └── style.css
├── music/
│   └── (your .wav/.mp3 loops here)
└── tags/
    └── tags.json (planned)
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
- Music trigger hook for combat
- Config UI for music libraries ✓
- Event-aware transition logic
- Packaging for release
