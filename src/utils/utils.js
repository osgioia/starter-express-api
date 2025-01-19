import { createLogger, format, transports } from "winston";
import { db } from "./db.server.js";
import fs from "fs";
import path from "path";
import morgan from "morgan";

function setupMorgan(app) {
  let accessLogStream;

  if (process.env.NODE_ENV === "production") {
    accessLogStream = fs.createWriteStream(
      path.join(process.cwd(), "access.log"),
      { flags: "a" }
    );
  }

  app.use(morgan("combined", { stream: accessLogStream || process.stdout }));
}

// Configuración de winston
const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "application.log" }),
  ],
});

function logMessage(level, message) {
  logger.log({ level, message });
}

async function checkTorrent(infoHash, callback) {
  try {
    const torrent = await db.torrent.findUnique({
      where: { infoHash },
    });
    if (!torrent) {
      throw new Error("Torrent not found");
    }
    callback(null);
  } catch (error) {
    callback(error);
  } finally {
    await db.$disconnect();
  }
}

async function bannedIPs(params, callback) {
  try {
    const bannedIPs = await db.iPBan.findMany();
    const ip = params.ipv6 || params.ip;
    const isBanned = bannedIPs.some(
      (ipBan) => ip >= ipBan.fromIP && ip <= ipBan.toIP
    );
    if (isBanned) {
      callback(new Error("IP Banned"));
    } else {
      callback(null);
    }
  } catch (error) {
    callback(error);
  } finally {
    await db.$disconnect();
  }
}

export { checkTorrent, bannedIPs, setupMorgan, logMessage };
