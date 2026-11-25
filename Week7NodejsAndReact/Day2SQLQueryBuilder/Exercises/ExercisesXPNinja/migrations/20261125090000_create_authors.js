// Exercise 1: create tables with the schema builder instead of raw SQL.
export async function up(knex) {
  await knex.schema.createTable("authors", table => {
    table.increments("id");
    table.string("name", 100).notNullable();
    table.string("country", 60);
  });
}

export async function down(knex) {
  await knex.schema.dropTable("authors");
}
