// The S7 two-table transaction pattern is reused here with the S14 schema.
// All imports stay within this project so it can run independently.
export function createUserModel(db) {
  // Cast a DATE to text in PostgreSQL to preserve the calendar date in any host timezone.
  const publicFields = ["id", "name", "email", db.raw("joined::text as joined")];
  return {
    createUser(user, passwordHash) {
      return db.transaction(async trx => {
        const [created] = await trx("users").insert(user).returning(publicFields);
        await trx("login").insert({ email: created.email, hash: passwordHash });
        return created;
      });
    },
    findUser(email) {
      return db("users").select(publicFields).where({ email }).first();
    },
    findLogin(email) {
      return db("login").select("email", "hash").where({ email }).first();
    },
  };
}
