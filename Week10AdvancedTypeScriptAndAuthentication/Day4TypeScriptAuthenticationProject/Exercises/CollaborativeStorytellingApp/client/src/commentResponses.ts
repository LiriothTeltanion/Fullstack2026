import type { StoryComment } from "./types";

const incompleteList = "The comment service returned incomplete data. Please try again.";
const incompleteMutation =
  "The comment service returned an incomplete response. Your change may have been saved. Reload the discussion before submitting again.";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

// Match the public fields returned by list/create/update in commentModel.js.
// Do not impose new body/date formats or require optional extension metadata.
function isComment(value: unknown): value is StoryComment {
  return (
    isRecord(value) &&
    isNumber(value.id) &&
    isNumber(value.storyId) &&
    isRecord(value.author) &&
    isNumber(value.author.id) &&
    typeof value.author.username === "string" &&
    typeof value.body === "string" &&
    typeof value.createdAt === "string"
  );
}

export function readCommentsResponse(value: unknown): { comments: StoryComment[] } {
  if (!isRecord(value) || !Array.isArray(value.comments) || !value.comments.every(isComment)) {
    throw new Error(incompleteList);
  }
  return { comments: value.comments };
}

export function readCommentResponse(value: unknown): { comment: StoryComment } {
  if (!isRecord(value) || !isComment(value.comment)) throw new Error(incompleteMutation);
  return { comment: value.comment };
}
