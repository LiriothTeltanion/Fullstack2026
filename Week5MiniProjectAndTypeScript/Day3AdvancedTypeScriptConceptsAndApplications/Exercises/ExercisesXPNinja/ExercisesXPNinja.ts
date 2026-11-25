// Exercises XP Ninja: a generic repository, keyof, mapped types and a typed event emitter
// Run with: node ExercisesXPNinja.ts
// Check with: npx tsc --strict --noEmit ExercisesXPNinja.ts

// Exercise 1: a generic in-memory repository for anything that has an id
interface Entity {
  id: number;
}

class Repository<T extends Entity> {
  private items = new Map<number, T>();

  add(item: T): T {
    this.items.set(item.id, item);
    return item;
  }

  findById(id: number): T | undefined {
    return this.items.get(id);
  }

  // Partial<T> lets the caller send only the fields that change
  update(id: number, changes: Partial<Omit<T, "id">>): T | undefined {
    const current = this.items.get(id);
    if (!current) return undefined;
    const updated = { ...current, ...changes };
    this.items.set(id, updated);
    return updated;
  }

  remove(id: number): boolean {
    return this.items.delete(id);
  }

  all(): T[] {
    return [...this.items.values()];
  }
}

interface Book extends Entity {
  title: string;
  author: string;
  available: boolean;
}

const books = new Repository<Book>();
books.add({ id: 1, title: "Dune", author: "Frank Herbert", available: true });
books.add({ id: 2, title: "Neuromancer", author: "William Gibson", available: true });
books.update(2, { available: false });
books.remove(3); // nothing happens, there is no book 3
console.log("1.", books.all());

// Exercise 2: keyof - read any property by name, with the right return type
function getField<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const dune = books.findById(1);
if (dune) {
  const title: string = getField(dune, "title");
  const available: boolean = getField(dune, "available");
  console.log("2.", title, available);
}

// Exercise 3: my own mapped types (like the built-in Readonly and Partial)
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
type Nullable<T> = { [K in keyof T]: T[K] | null };

const frozenBook: MyReadonly<Book> = {
  id: 9,
  title: "Hyperion",
  author: "Dan Simmons",
  available: true,
};
// frozenBook.title = "x";  <- error: read-only
const draft: Nullable<Book> = { id: 10, title: "Untitled", author: null, available: null };
console.log("3.", frozenBook.title, "|", draft);

// Exercise 4: an event emitter where each event name has its own payload type
type AppEvents = {
  login: { user: string };
  logout: { user: string; minutes: number };
  error: { message: string };
};

class TypedEmitter<Events extends Record<string, object>> {
  private listeners: { [E in keyof Events]?: Array<(payload: Events[E]) => void> } = {};

  on<E extends keyof Events>(event: E, listener: (payload: Events[E]) => void): void {
    (this.listeners[event] ??= []).push(listener);
  }

  emit<E extends keyof Events>(event: E, payload: Events[E]): void {
    this.listeners[event]?.forEach(listener => listener(payload));
  }
}

const events = new TypedEmitter<AppEvents>();
events.on("login", ({ user }) => console.log(`4. ${user} logged in`));
events.on("logout", ({ user, minutes }) => console.log(`4. ${user} left after ${minutes} min`));
events.emit("login", { user: "kevin" });
events.emit("logout", { user: "kevin", minutes: 42 });
// events.emit("login", { minutes: 1 });  <- error: wrong payload for "login"

// Exercise 5: Record<K, V> for a lookup table with fixed keys
type Role = "admin" | "editor" | "viewer";
const permissions: Record<Role, string[]> = {
  admin: ["read", "write", "delete"],
  editor: ["read", "write"],
  viewer: ["read"],
};
(Object.keys(permissions) as Role[]).forEach(role =>
  console.log(`5. ${role.padEnd(6)} -> ${permissions[role].join(", ")}`)
);

export {};
