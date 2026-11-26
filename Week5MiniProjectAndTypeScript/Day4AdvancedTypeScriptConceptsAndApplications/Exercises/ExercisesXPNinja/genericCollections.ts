/** A reusable collection: intersections are expressed by the caller's item type. */
export class Container<T extends object> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  remove(item: T): boolean {
    const index = this.items.indexOf(item);
    if (index < 0) return false;
    this.items.splice(index, 1);
    return true;
  }

  list(): T[] {
    // Return a snapshot so callers cannot change the collection by editing the array.
    return [...this.items];
  }
}

/** The generic parameter records the payload type of an already decoded response. */
export interface Response<T> {
  data: T;
  status: number;
}

export function parseResponse<T>(response: Response<unknown>): T {
  // An assertion is compile-time only. Validate untrusted network JSON before calling.
  return response.data as T;
}

export class Repository<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  retrieve(index: number): T | undefined {
    if (!Number.isInteger(index) || index < 0) return undefined;
    return this.items[index] as T | undefined;
  }

  list(): T[] {
    return [...this.items];
  }
}
