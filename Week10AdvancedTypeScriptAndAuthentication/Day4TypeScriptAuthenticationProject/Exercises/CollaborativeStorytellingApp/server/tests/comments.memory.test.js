import test from "node:test";
import { exerciseComments } from "./commentsFixture.js";

test("story comments: local in-memory HTTP contract", async t => {
  await exerciseComments(t, "memory");
});
