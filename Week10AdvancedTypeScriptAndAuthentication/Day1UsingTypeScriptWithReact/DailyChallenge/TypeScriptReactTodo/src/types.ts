export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: Priority;
}

export type Priority = "low" | "medium" | "high";
export type Filter = "all" | "active" | "completed";
