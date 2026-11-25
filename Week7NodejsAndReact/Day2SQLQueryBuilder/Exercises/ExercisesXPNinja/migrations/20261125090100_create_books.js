export async function up(knex) {
  await knex.schema.createTable("books", table => {
    table.increments("id");
    table.string("title", 200).notNullable();
    table.integer("year");
    // Deleting an author also deletes their books.
    table
      .integer("author_id")
      .notNullable()
      .references("id")
      .inTable("authors")
      .onDelete("CASCADE");
  });
}

export async function down(knex) {
  await knex.schema.dropTable("books");
}
