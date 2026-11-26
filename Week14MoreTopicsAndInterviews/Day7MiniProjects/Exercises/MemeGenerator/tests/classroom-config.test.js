import assert from "node:assert/strict";
import test from "node:test";
import configure from "../vite.config.js";

test("a classroom production build is rejected before a private sheet can be read", () => {
  assert.throws(
    () => configure({ command: "build", mode: "classroom" }),
    /Classroom styles are development-only/
  );
});
