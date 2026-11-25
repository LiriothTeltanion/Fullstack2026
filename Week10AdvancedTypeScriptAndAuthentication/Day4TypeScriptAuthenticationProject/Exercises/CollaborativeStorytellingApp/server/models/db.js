// In-memory "tables". Everything resets when the server restarts.
export const db = {
  users: [], // { id, username, passwordHash }
  stories: [], // { id, title, content, authorId, contributorIds, createdAt, updatedAt }
  nextUserId: 1,
  nextStoryId: 1,
};
