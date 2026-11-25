import test from "node:test";
import { exerciseComments } from "./commentsFixture.js";

test("story comments: real PostgreSQL/PGlite SQL and HTTP contract", async t => {
  await exerciseComments(t, "postgres");
});
