import { database } from "./database.js";

export function createSession(id, userId, refreshId, expiresAt) {
  database
    .prepare("INSERT INTO sessions(id,userId,refreshId,expiresAt) VALUES(?,?,?,?)")
    .run(id, userId, refreshId, expiresAt);
}
export function activeSession(id) {
  return database
    .prepare("SELECT * FROM sessions WHERE id=? AND revoked=0 AND expiresAt>?")
    .get(id, Date.now());
}
export function rotateSession(id, previousId, nextId) {
  // One compare-and-swap winner prevents two refreshes from reusing one token.
  return (
    database
      .prepare(
        "UPDATE sessions SET refreshId=? WHERE id=? AND refreshId=? AND revoked=0 AND expiresAt>?"
      )
      .run(nextId, id, previousId, Date.now()).changes === 1
  );
}
export function revokeSession(id) {
  database.prepare("UPDATE sessions SET revoked=1 WHERE id=?").run(id);
}
