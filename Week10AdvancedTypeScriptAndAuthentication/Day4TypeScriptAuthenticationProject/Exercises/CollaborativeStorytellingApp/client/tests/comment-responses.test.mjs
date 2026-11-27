import assert from "node:assert/strict";
import test from "node:test";
import { readCommentsResponse, readCommentResponse } from "../src/commentResponses.ts";

const comment = () => ({
  id: 7,
  storyId: 3,
  author: { id: 2, username: "Synthetic reader" },
  body: "A new chapter שלום café.",
  createdAt: "2026-11-27T05:00:00.000Z",
});
const incomplete = { message: "The comment service returned incomplete data. Please try again." };
const uncertainMutation = {
  message:
    "The comment service returned an incomplete response. Your change may have been saved. Reload the discussion before submitting again.",
};

test("normal and empty lists retain the existing public JSON contract", () => {
  const row = comment();
  const result = readCommentsResponse({ comments: [row] });
  assert.deepEqual(result, { comments: [row] });
  assert.equal(result.comments[0], row);
  assert.deepEqual(readCommentsResponse({ comments: [] }), { comments: [] });
});

test("comments need no new metadata or stricter date/body formats", () => {
  const legacy = { ...comment(), createdAt: "November 2026", body: "" };
  assert.equal(readCommentResponse({ comment: legacy }).comment, legacy);
  const extended = {
    ...comment(),
    updatedAt: "2026-11-27",
    author: { ...comment().author, avatar: null },
  };
  assert.equal(readCommentsResponse({ comments: [extended] }).comments[0], extended);
});

test("missing, null and non-array collections produce a useful retryable error", () => {
  for (const response of [
    undefined,
    null,
    {},
    { comments: null },
    { comments: {} },
    { comments: "" },
  ]) {
    assert.throws(() => readCommentsResponse(response), incomplete);
  }
});

test("incomplete list rows are rejected before any collection reaches the reader", () => {
  const missingFields = ["id", "storyId", "author", "body", "createdAt"].map(key => {
    const row = comment();
    delete row[key];
    return row;
  });
  const malformed = [
    null,
    ...missingFields,
    { ...comment(), author: null },
    { ...comment(), author: { id: 2 } },
    { ...comment(), body: null },
    { ...comment(), id: "7" },
    { ...comment(), createdAt: null },
  ];
  for (const row of malformed) {
    assert.throws(() => readCommentsResponse({ comments: [comment(), row] }), incomplete);
  }
});

test("create and edit responses use the same checked comment record", () => {
  const row = comment();
  assert.equal(readCommentResponse({ comment: row }).comment, row);
  const edited = { ...row, body: "An edited chapter." };
  assert.equal(readCommentResponse({ comment: edited }).comment, edited);
  for (const response of [
    undefined,
    null,
    {},
    { comment: null },
    { comment: { body: "Incomplete" } },
  ]) {
    assert.throws(() => readCommentResponse(response), uncertainMutation);
  }
});

test("reading a valid response after an invalid response needs no reset or mutation", () => {
  const row = Object.freeze({ ...comment(), author: Object.freeze(comment().author) });
  const response = Object.freeze({ comments: Object.freeze([row]) });
  assert.throws(() => readCommentsResponse({ comments: null }), incomplete);
  assert.equal(readCommentsResponse(response).comments, response.comments);
  assert.throws(() => readCommentResponse({ comment: null }), uncertainMutation);
  assert.equal(readCommentResponse({ comment: row }).comment, row);
});
