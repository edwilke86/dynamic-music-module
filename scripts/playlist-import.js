/**
 * Import songs into playlists
 */

async function importSongsAsPlaylists() {
  
  // --- Folder Setup ---
  const PARENT_FOLDER_NAME = "Dynamic Music Module";
  let parentFolder = game.folders.find(f => f.name === PARENT_FOLDER_NAME && f.type === "Playlist");
  if (!parentFolder) {
    parentFolder = await Folder.create({ name: PARENT_FOLDER_NAME, type: "Playlist", parent: null });
  }

  const folderNames = ["Peaceful", "Combat", "Links", "Other"];
  const folderIds = {};

  for (const name of folderNames) {
    let folder = game.folders.find(f => 
      f.name === name && 
      f.type === "Playlist" && 
      (f.parent?.id === parentFolder.id || f.folder?.id === parentFolder.id)
    );
    
    if (!folder) {
      folder = await Folder.create({ name: name, type: "Playlist", parent: parentFolder.id });
    }
    folderIds[name] = folder.id;
  }

  // --- Song Playlist Import ---
  // Use the combined 'allSongs' library to ensure all songs are imported.
  for (const song of window.DMM.allSongs) {
    let playlist = game.playlists.find(p => p.name === song.name);

    // Determine folder
    let targetFolderId = folderIds.Other;
    if (song.tags.includes("peaceful")) targetFolderId = folderIds.Peaceful;
    else if (song.tags.includes("combat")) targetFolderId = folderIds.Combat;

    if (!playlist) {
      playlist = await Playlist.create({
        name: song.name,
        description: `Tags: ${song.tags.join(", ")}`,
        mode: CONST.PLAYLIST_MODES.SIMULTANEOUS,
        folder: targetFolderId
      });
      console.log(`%cDynamic Music Module | Created playlist: ${song.name}`, "color: #00ccff;");
    } else {
      // Ensure existing playlists are in the correct folder and have updated metadata
      await playlist.update({
        folder: targetFolderId,
        description: `Tags: ${song.tags.join(", ")}`
      });
    }

    const existingSoundPaths = playlist.sounds.map(s => s.path);
    const soundsToAdd = [];

    // Handle both simple track arrays (string[]) and combat track objects ({path, intensity})
    const trackPaths = song instanceof LayeredCombatSong
      ? song.tracks.map(t => t.path)
      : song.tracks;

    for (const trackPath of trackPaths) {
      const fullPath = `modules/dynamic-music-module/${trackPath}`;
      if (!existingSoundPaths.includes(fullPath)) {
        soundsToAdd.push({
          name: trackPath.split('/').pop().replace(/\.ogg$/, ''),
          path: fullPath,
          volume: 1.0,
          repeat: true,
        });
      }
    }

    if (soundsToAdd.length > 0) {
      await playlist.createEmbeddedDocuments("PlaylistSound", soundsToAdd);
      console.log(`%cDynamic Music Module | Added ${soundsToAdd.length} tracks to ${song.name}`, "color: #00ccff;");
    }
  }

  // --- Link Tracks Playlist Import ---
  let linkPlaylist = game.playlists.find(p => p.name === "Links");
  if (!linkPlaylist) {
    linkPlaylist = await Playlist.create({
      name: "Links",
      description: "Collection of all link tracks for musical transitions.",
      mode: CONST.PLAYLIST_MODES.SEQUENTIAL,
      folder: folderIds.Links
    });
    console.log(`%cDynamic Music Module | Created playlist: Links`, "color: #00ccff;");
  } else {
    await linkPlaylist.update({
      folder: folderIds.Links,
      description: "Collection of all link tracks for musical transitions."
    });
  }

  const existingLinkPaths = linkPlaylist.sounds.map(s => s.path);
  const linksToAdd = [];

  for (const transition of window.DMM.transitionLibrary) {
    const fullPath = `modules/dynamic-music-module/${transition.track}`;
    if (!existingLinkPaths.includes(fullPath)) {
      linksToAdd.push({
        name: transition.name,
        path: fullPath,
        volume: 0.8,
        repeat: false,
      });
    }
  }

  if (linksToAdd.length > 0) {
    await linkPlaylist.createEmbeddedDocuments("PlaylistSound", linksToAdd);
    console.log(`%cDynamic Music Module | Added ${linksToAdd.length} tracks to Links`, "color: #00ccff;");
  }
}

window.DMM = window.DMM || {};
window.DMM.importSongsAsPlaylists = importSongsAsPlaylists;