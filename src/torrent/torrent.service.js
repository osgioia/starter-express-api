import { db } from "../utils/db.server.js";
import { logMessage } from "../utils/utils.js";
import magnet from 'magnet-uri';

async function addTorrent(infoHash, name, category, tags) {
  try {
    await db.torrent.create({
      data: {
        infoHash: infoHash,
        name: name,
        category: { create: { name: category } },
        tags: { create: tags.split(",").map((tag) => ({ name: tag })) },
      },
    });
    logMessage("info", "Torrent added");
  } catch (error) {
    logMessage("error", `Error to add torrent:${error.message}`);
  } finally {
    await db.$disconnect();
  }
}

async function getTorrent(infoHash, hostname) {
  try {
    const torrent = await db.torrent.findFirst({
      where: {
        infoHash: infoHash
    }});

    const uri = magnet.encode({
      xt: `urn:btih:${torrent.infoHash}`,
      dn: torrent.name,
      tr: `${hostname}:${process.env.PORT}/announce`
    })
    return uri
  } catch (error) {
    logMessage("error", `Error to get torrents:${error.message}`);
    res.status(500).json({ error: "Error in get Torrent" });
  } finally {
    await db.$disconnect();
  }
}

async function updateTorrent(id, data) {
  try {
    const updatedTorrent = await db.torrent.update({
      where: { id },
      data,
    });
    logMessage("log", `Torrent updated: ${updatedTorrent}`);
  } catch (error) {
    logMessage("error", `Error to update torrent:${error.message}`);
  } finally {
    await db.$disconnect();
  }
}

async function deleteTorrent(id) {
  try {
    await db.torrent.delete({
      where: { id },
    });
    logMessage("info", "Torrent deleted");
  } catch (error) {
    logMessage("error", `Error to delete torrent: ${error.message}`);
  } finally {
    await db.$disconnect();
  }
}

export { addTorrent, deleteTorrent, getTorrent as searchTorrent, updateTorrent };
