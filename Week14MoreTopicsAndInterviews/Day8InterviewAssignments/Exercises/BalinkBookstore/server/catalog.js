export const stores = [
  {
    id: "paper-lantern",
    name: "Paper Lantern",
    city: "Paris",
    address: "12 Fiction Lane",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "chapter-house",
    name: "Chapter House",
    city: "Madrid",
    address: "8 Sample Avenue",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "atlas-books",
    name: "Atlas Books",
    city: "New York",
    address: "24 Practice Street",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=700&q=80",
  },
];
export const books = [
  {
    id: "night-garden",
    title: "The Night Garden",
    author: "Elena Vale",
    genre: "Fiction",
    priceCents: 1800,
    pages: 248,
    publisher: "Practice Press",
    language: "English",
    tone: "#315f53",
    description:
      "A gardener discovers a collection of letters that changes how a quiet neighborhood remembers its past.",
    storeIds: ["paper-lantern", "chapter-house", "atlas-books"],
  },
  {
    id: "small-orbits",
    title: "Small Orbits",
    author: "Samuel North",
    genre: "Science",
    priceCents: 2250,
    pages: 312,
    publisher: "Practice Press",
    language: "English",
    tone: "#324c72",
    description:
      "An approachable journey through the ideas that connect planets, satellites and everyday motion.",
    storeIds: ["paper-lantern", "atlas-books"],
  },
  {
    id: "paper-maps",
    title: "Paper Maps",
    author: "Lucia Mar",
    genre: "Travel",
    priceCents: 1600,
    pages: 192,
    publisher: "Practice Press",
    language: "Spanish",
    tone: "#ab603a",
    description:
      "Short stories about finding a place, getting lost and learning to notice the streets in between.",
    storeIds: ["paper-lantern", "chapter-house"],
  },
  {
    id: "quiet-notes",
    title: "Quiet Notes",
    author: "Mira Rowan",
    genre: "Music",
    priceCents: 1950,
    pages: 224,
    publisher: "Practice Press",
    language: "English",
    tone: "#6b4c69",
    description:
      "A musician keeps a notebook of listening exercises, small discoveries and unfinished melodies.",
    storeIds: ["paper-lantern", "chapter-house", "atlas-books"],
  },
  {
    id: "ordinary-light",
    title: "Ordinary Light",
    author: "David Ash",
    genre: "Photography",
    priceCents: 2800,
    pages: 160,
    publisher: "Practice Press",
    language: "English",
    tone: "#8a7138",
    description:
      "A collection of practical observations about light, composition and photographs made close to home.",
    storeIds: ["paper-lantern", "atlas-books"],
  },
  {
    id: "first-lines",
    title: "First Lines",
    author: "Irene Sol",
    genre: "Writing",
    priceCents: 1450,
    pages: 176,
    publisher: "Practice Press",
    language: "Spanish",
    tone: "#8b424a",
    description:
      "Original writing prompts for building a character, a scene and the courage to finish a short story.",
    storeIds: ["chapter-house", "atlas-books"],
  },
];
