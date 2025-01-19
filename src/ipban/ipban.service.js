import { db } from "../utils/db.server.js";
import { logMessage } from "../utils/utils.js";

async function listAllIPBan() {
  try {
    return await db.iPBan.findMany();
  } catch (error) {
    logMessage("error", `Error to get data:${error.message}`);
  } finally {
    await db.$disconnect();
  }
}

async function createIPBan(data) {
  try {
    return await db.iPBan.create({
      data
    });
  } catch (error) {
    logMessage("error", `Error to add ip:${error.message}`);
  } finally {
    await db.$disconnect();
  }
}

async function updateIPBan(id, data) {
  try {
    return await db.iPBan.update({
      where: { id },
      data
    });
  } catch (error) {
    logMessage("error", `Error to update ip:${error.message}`);
  } finally {
    await db.$disconnect();
  }
}

async function deleteIPBan(id) {
  try {
    return await db.iPBan.delete({
      where: { id }
    });
  } catch (error) {
    logMessage("error", `Error to delete ip:${error.message}`);
  } finally {
    await db.$disconnect();
  }
}

async function bulkCreateIPBan(dataArray) {
  try {
    return await db.iPBan.createMany({
      data: dataArray,
      skipDuplicates: true
    });
  } catch (error) {
    logMessage("error", `Error to load bulk ips:${error.message}`);
  } finally {
    await db.$disconnect();
  }
}

export { listAllIPBan, createIPBan, updateIPBan, deleteIPBan, bulkCreateIPBan };
