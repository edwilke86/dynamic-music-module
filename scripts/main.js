/**
 * dynamic Music Module
 * Author: Neo Shain
    * Original Music: Dallas Scott Wilke
 * Description: Logs module load and prepares hooks for music adaptation logic.
 */

Hooks.once("init", () => {
  console.log("Dynamic Music Module | Initializing...");
});

Hooks.once("ready", () => {
  const banner = `
██████╗ ███╗   ███╗███╗   ███╗
██╔══██╗████╗ ████║████╗ ████║
██║  ██║██╔████╔██║██╔████╔██║
██║  ██║██║╚██╔╝██║██║╚██╔╝██║
██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║
╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝
        🎵 DYNAMIC MUSIC MODULE READY 🎵`;

  console.log(`%c${banner}`, "color: #00ccff; font-weight: bold; font-family: monospace;");
});



