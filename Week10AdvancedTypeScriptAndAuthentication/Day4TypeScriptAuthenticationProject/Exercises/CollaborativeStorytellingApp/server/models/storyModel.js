/** @typedef {import("../../shared/types").Story} PublicStory */
import { db, pool, usePostgres, tables } from "./db.js";
import { findUserById } from "./userModel.js";

async function fromRow(row) {
  if (!row) return undefined;
  const result = await pool.query(
    `SELECT user_id FROM ${tables.story_contributors} WHERE story_id = $1 ORDER BY user_id`,
    [row.id]
  );
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    authorId: row.author_id,
    contributorIds: result.rows.map(item => item.user_id),
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export async function listStories() {
  if (!usePostgres) return [...db.stories].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const result = await pool.query(
    `SELECT * FROM ${tables.stories} ORDER BY updated_at DESC, id DESC`
  );
  return Promise.all(result.rows.map(fromRow));
}

export async function findStory(id) {
  if (!Number.isSafeInteger(id) || id < 1) return undefined;
  if (!usePostgres) return db.stories.find(story => story.id === id);
  const result = await pool.query(`SELECT * FROM ${tables.stories} WHERE id = $1`, [id]);
  return fromRow(result.rows[0]);
}

export async function createStory({ title, content, authorId }) {
  if (usePostgres) {
    const result = await pool.query(
      `INSERT INTO ${tables.stories} (title, content, author_id) VALUES ($1, $2, $3) RETURNING *`,
      [title, content, authorId]
    );
    return fromRow(result.rows[0]);
  }
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

export async function updateStory(story, changes) {
  if (!usePostgres) {
    Object.assign(story, changes, { updatedAt: new Date().toISOString() });
    return story;
  }
  const result = await pool.query(
    `UPDATE ${tables.stories} SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *`,
    [changes.title ?? story.title, changes.content ?? story.content, story.id]
  );
  const updated = await fromRow(result.rows[0]);
  if (!updated) {
    const error = new Error("Story not found");
    error.status = 404;
    throw error;
  }
  return updated;
}

export async function deleteStory(id) {
  if (!usePostgres) {
    db.stories = db.stories.filter(story => story.id !== id);
    db.contributors = db.contributors.filter(item => item.storyId !== id);
    return;
  }
  await pool.query(`DELETE FROM ${tables.stories} WHERE id = $1`, [id]);
}

export async function inviteContributor(story, userId) {
  if (!usePostgres) {
    if (!story.contributorIds.includes(userId)) {
      story.contributorIds.push(userId);
      db.contributors.push({ id: db.nextContributorId++, storyId: story.id, userId });
    }
    return story;
  }
  const result = await pool.query(
    `INSERT INTO ${tables.story_contributors} (story_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING user_id`,
    [story.id, userId]
  );
  if (!result.rows.length) {
    const error = new Error("That user can already edit this story");
    error.status = 409;
    throw error;
  }
  return findStory(story.id);
}

export function canEdit(story, userId) {
  return story.authorId === userId || story.contributorIds.includes(userId);
}

/** @returns {Promise<PublicStory>} */
export async function toPublicStory(story) {
  const author = await findUserById(story.authorId);
  const relationships = await listContributors(story.id);
  const contributors = await Promise.all(story.contributorIds.map(findUserById));
  return {
    id: story.id,
    title: story.title,
    content: story.content,
    author: { id: story.authorId, username: author?.username ?? "unknown" },
    contributors: contributors.map((user, index) => ({
      id: story.contributorIds[index],
      username: user?.username ?? "unknown",
      contributionId: relationships.find(item => item.userId === story.contributorIds[index])?.id,
    })),
    createdAt: story.createdAt,
    updatedAt: story.updatedAt,
  };
}

export async function listContributors(storyId) {
  if (usePostgres) {
    const result = await pool.query(
      `SELECT c.id, c.user_id, u.username FROM ${tables.story_contributors} c JOIN ${tables.users} u ON u.id = c.user_id WHERE c.story_id = $1 ORDER BY c.id`,
      [storyId]
    );
    return result.rows.map(row => ({ id: row.id, userId: row.user_id, username: row.username }));
  }
  return Promise.all(
    db.contributors
      .filter(item => item.storyId === storyId)
      .map(async item => ({
        id: item.id,
        userId: item.userId,
        username: (await findUserById(item.userId))?.username ?? "unknown",
      }))
  );
}

export async function findContributor(id) {
  if (!usePostgres) return db.contributors.find(item => item.id === id);
  const result = await pool.query(`SELECT * FROM ${tables.story_contributors} WHERE id = $1`, [id]);
  const row = result.rows[0];
  return row && { id: row.id, userId: row.user_id, storyId: row.story_id };
}

export async function removeContributor(item) {
  if (usePostgres) {
    await pool.query(`DELETE FROM ${tables.story_contributors} WHERE id = $1`, [item.id]);
  } else {
    db.contributors = db.contributors.filter(row => row.id !== item.id);
    const story = db.stories.find(row => row.id === item.storyId);
    if (story) story.contributorIds = story.contributorIds.filter(id => id !== item.userId);
  }
}
