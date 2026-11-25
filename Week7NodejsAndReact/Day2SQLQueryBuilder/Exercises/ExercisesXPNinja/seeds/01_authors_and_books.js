// Exercise 2: a seed empties the tables and fills them with known rows.
export async function seed(knex) {
  await knex("books").del();
  await knex("authors").del();

  const [tolkien, leGuin, herbert] = await knex("authors")
    .insert([
      { name: "J.R.R. Tolkien", country: "United Kingdom" },
      { name: "Ursula K. Le Guin", country: "United States" },
      { name: "Frank Herbert", country: "United States" },
    ])
    .returning("id");

  await knex("books").insert([
    { title: "The Hobbit", year: 1937, author_id: tolkien.id },
    { title: "The Lord of the Rings", year: 1954, author_id: tolkien.id },
    { title: "A Wizard of Earthsea", year: 1968, author_id: leGuin.id },
    { title: "The Dispossessed", year: 1974, author_id: leGuin.id },
    { title: "Dune", year: 1965, author_id: herbert.id },
  ]);
}
