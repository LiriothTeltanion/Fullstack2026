// Development/test helper. Production uses the ordinary PostgreSQL connection in db.js.
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";
import { readFile } from "node:fs/promises";
import { createDatabase } from "../db.js";

export async function createFixture() {
  const engine = await PGlite.create();
  const socket = new PGLiteSocketServer({
    db: engine,
    host: "127.0.0.1",
    port: 0,
    maxConnections: 10,
  });
  let db;
  try {
    await engine.exec(await readFile(new URL("./schema.sql", import.meta.url), "utf8"));
    await socket.start();
    const connection = new URL("postgresql://" + socket.getServerConn());
    db = createDatabase({
      PG_HOST: "127.0.0.1",
      PG_PORT: connection.port,
      PG_USER: "postgres",
      PG_PASSWORD: "fixture",
      PG_DATABASE: "postgres",
      PG_POOL_MAX: "1",
    });
    return {
      db,
      async close() {
        await db.destroy();
        await socket.stop();
        await engine.close();
      },
    };
  } catch (error) {
    await db?.destroy();
    await socket.stop();
    await engine.close();
    throw error;
  }
}
