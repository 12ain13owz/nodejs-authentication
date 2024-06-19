import mongoose from "mongoose";
import config from "config";
import log from "./logger";

export default async function dbConnect() {
  try {
    const dbUri = config.get<string>("dbUri");
    const dbName = config.get<string>("dbName");

    await mongoose.connect(dbUri, { dbName });
    log.info("Connected to Database successfully");
  } catch (error) {
    log.error("dbConnect:", error);
    process.exit(1);
  }
}
