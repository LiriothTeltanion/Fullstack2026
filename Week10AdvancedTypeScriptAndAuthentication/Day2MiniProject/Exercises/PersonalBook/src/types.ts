export type ReadingStatus = "to read" | "reading" | "finished";

export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  status: ReadingStatus;
}
