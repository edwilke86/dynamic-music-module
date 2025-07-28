/**
 * Dynamic Music Module
 * Author: Neo Shain
 * Original Music: Dallas Scott Wilke
 */

Hooks.once("init", () => {
  console.log("%cDynamic Music Module | Initializing...", "color: #00ccff;");
});

Hooks.once("ready", async () => {
  const banner = `
██████╗ ███╗   ███╗███╗   ███╗
██╔══██╗████╗ ████║████╗ ████║
██║  ██║██╔████╔██║██╔████╔██║
██║  ██║██║╚██╔╝██║██║╚██╔╝██║
██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║
╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝
        🎵 DYNAMIC MUSIC MODULE READY 🎵`;

  console.log(`%c${banner}`, "color: #00ccff; font-weight: bold; font-family: monospace;");

  // Import songs into playlists automatically on every load
  await window.DMM.importSongsAsPlaylists();
  console.log("%cDynamic Music Module | Verified and/or created playlists.", "color: #00ccff;");

  // Render the UI
  new window.DMM.UI().render(true);
  console.log("%cDynamic Music Module | UI rendered.", "color: #00ccff;");
});
