import { test, mock } from "node:test";
import assert from "node:assert/strict";
import * as first from "../../Week3JavaScriptandDOM/Day2FunctionsandDOMIntroduction/Exercises/BuildFacebook1/auth.js";
import * as second from "../../Week3JavaScriptandDOM/Day2FunctionsandDOMIntroduction/Exercises/BuildFacebook2/auth.js";

test("single account accepts its pair and rejects mismatched credentials", () => {
  const log = mock.method(console, "log", () => {});
  const user = first.database[0];
  assert.equal(first.database.length, 1);
  assert.equal(first.signIn(user.username, user.password), first.newsfeed);
  assert.equal(first.signIn(user.username, "wrong"), null);
  assert.equal(first.signIn("unknown", user.password), null);
  assert.equal(log.mock.callCount(), 1);
  log.mock.restore();
});

test("three-account validation checks each complete row", () => {
  assert.equal(second.database.length, 3);
  for (const [i, user] of second.database.entries()) {
    for (const [j, other] of second.database.entries()) {
      assert.equal(second.isUserValid(user.username, other.password), i === j);
    }
  }
  assert.equal(second.isUserValid("unknown", "wrong"), false);
});

test("third account reaches the feed and invalid pairs never log it", () => {
  const log = mock.method(console, "log", () => {});
  const user = second.database[2];
  assert.equal(second.signIn(user.username, user.password), second.newsfeed);
  assert.equal(second.signIn(user.username, second.database[0].password), null);
  assert.equal(log.mock.callCount(), 1);
  log.mock.restore();
});
