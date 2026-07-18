// LibrarySystem — Daily Challenge: Building a Library System
// ----------------------------------------------------------
// Single-file solution with interfaces, classes, access modifiers, optional and readonly properties,
// and basic inheritance. Includes an optional demo guarded to avoid running during imports.

// Interface: Book
export interface Book {
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  genre?: string; // optional
}

// Class: Library
export class Library {
  // Private internal storage for books
  private books: Book[] = [];

  // Add a new book to the library
  public addBook(book: Book): void {
    // Prevent duplicates by ISBN (replace if exists, else push)
    const idx = this.books.findIndex(b => b.isbn === book.isbn);
    if (idx !== -1) {
      this.books[idx] = book;
    } else {
      this.books.push(book);
    }
  }

  // Return details of a book (formatted string) based on ISBN
  public getBookDetails(isbn: string): string {
    const b = this.books.find(book => book.isbn === isbn);
    if (!b) return "Book not found.";
    const genrePart = b.genre ? ` | Genre: ${b.genre}` : "";
    return `Title: ${b.title} | Author: ${b.author} | ISBN: ${b.isbn} | Year: ${b.publishedYear}${genrePart}`;
  }

  // Protected helper for subclasses that need book access without exposing it publicly
  protected getAllBooks(): ReadonlyArray<Book> {
    return this.books;
  }
}

// Class: DigitalLibrary (extends Library)
export class DigitalLibrary extends Library {
  // Readonly website property
  public readonly website: string;

  constructor(website: string) {
    super();
    this.website = website;
  }

  // Return a list of all book titles
  public listBooks(): string[] {
    return this.getAllBooks().map(b => b.title);
  }
}

// ------------------------
// Optional demo (guarded):
// ------------------------
declare const require: any | undefined;
declare const module: any | undefined;

if (typeof require !== "undefined" && typeof module !== "undefined" && require.main === module) {
  const dl = new DigitalLibrary("https://library.example.com");

  dl.addBook({
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "9780132350884",
    publishedYear: 2008,
    genre: "Software Engineering",
  });

  dl.addBook({
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt, David Thomas",
    isbn: "9780201616224",
    publishedYear: 1999,
  });

  dl.addBook({
    title: "You Don't Know JS Yet",
    author: "Kyle Simpson",
    isbn: "9781098124045",
    publishedYear: 2020,
    genre: "JavaScript",
  });

  // Print details by ISBN
  console.log(dl.getBookDetails("9780132350884"));
  console.log(dl.getBookDetails("9780201616224"));
  console.log(dl.getBookDetails("9781098124045"));
  console.log(dl.getBookDetails("0000000000000")); // not found

  // Print list of titles
  console.log("All book titles:", dl.listBooks());

  // Print website
  console.log("Digital Library website:", dl.website);
}
