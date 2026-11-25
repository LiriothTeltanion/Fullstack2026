// Exercise 3: use the logger module from another file
import { createLogger } from "./logger.js";

const appLog = createLogger("app");
const dbLog = createLogger("db", "debug"); // this one also shows debug messages

appLog.debug("not shown, the app logger starts at info");
appLog.info("server starting");
dbLog.debug("opening connection");
dbLog.warn("slow query: 1200 ms");
appLog.error("could not read config.json");

console.log(`\napp kept ${appLog.history().length} lines, db kept ${dbLog.history().length}`);
