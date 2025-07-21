# dynamic Music Module (DMM) for Foundry VTT

**Code & Scripting by:** Neo Shain  
**Original Music by:** Dallas Scott Wilke  
**Version:** 0.1.0  
**System Compatibility:** Foundry VTT v13+  
**Status:** In development (Private)

> 🧑‍🎤 *Note: Neo Shain and Dallas Scott Wilke are the same person.*  
> Neo Shain is the creative alias used for game development and scripting.  
> Dallas Scott Wilke is credited for all musical composition and scoring.

---

## 🎧 What is DMM?

The **dynamic Music Module** brings a dynamic, immersive soundtrack system to Foundry VTT. Designed to respond to in-game events, DMM intelligently adjusts music in real-time—transitioning seamlessly between tracks based on:

- 🎭 Emotional tone
- ⚔️ Combat status
- ❤️ Party health
- ☠️ Enemy types (bosses, mobs, etc.)
- 📍 Scene location or tag
- 📘 Narrative beats or custom triggers

---

## 🔧 Planned Features

- Tag-based music loop management system
- Custom music stem support (layered ambient + rhythmic tracks)
- Auto-detection of combat start/end
- Optional GM controls for overriding or queuing tracks
- Transition logic with fade-in/out and crossfade
- Preset libraries for moods like *tense, eerie, hopeful, triumphant*

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
📧 edwilke86@gmail.com

## 🚧 Development Roadmap
 - Basic tag system
 - Music trigger hook for combat
 - Config UI for music libraries
 - Event-aware transition logic
 - Packaging for release & sale

