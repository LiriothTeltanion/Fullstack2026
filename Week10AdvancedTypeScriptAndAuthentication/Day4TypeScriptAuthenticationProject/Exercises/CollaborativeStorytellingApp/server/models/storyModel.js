import { db } from "./db.js";
import { findUserById } from "./userModel.js";

export function listStories() {
  return [...db.stories].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function findStory(id) {
  return db.stories.find(story => story.id === id);
}

export function createStory({ title, content, authorId }) {
  const now = new Date().toISOString();
  const story = {
    id: db.nextStoryId++,
    title,
    content,
    authorId,
    contributorIds: [],
    createdAt: now,
    updatedAt: now,
  };
  db.stories.push(story);
  return story;
}

export function updateStory(story, changes) {
  Object.assign(story, changes, { updatedAt: new Date().toISOString() });
  return story;
}

export function deleteStory(id) {
  db.stories = db.stories.filter(story => story.id !== id);
}

export function canEdit(story, userId) {
  return story.authorId === userId || story.contributorIds.includes(userId);
}

// The shape the client gets: usernames instead of bare ids.
export function toPublicStory(story) {
  return {
    id: story.id,
    title: story.title,
    content: story.content,
    author: { id: story.authorId, username: findUserById(story.authorId)?.username ?? "unknown" },
    contributors: story.contributorIds.map(id => ({
      id,
      username: findUserById(id)?.username ?? "unknown",
    })),
    createdAt: story.createdAt,
    updatedAt: story.updatedAt,
  };
}
