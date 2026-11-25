// Knex runs up() once and records it in the knex_migrations table.
export function up(knex) {
  return knex.schema.createTable("messages", table => {
    table.increments("id");
    table.string("name", 40).notNullable();
    table.string("text", 280).notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTableIfExists("messages");
}
