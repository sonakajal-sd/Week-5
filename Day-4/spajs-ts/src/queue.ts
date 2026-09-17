/**
 * A small generic queue (first in, first out).
 *
 * `<T>` means "whatever type you create the Queue with" — a `Queue<string>`
 * only ever holds strings, a `Queue<number>` only ever holds numbers, and
 * `enqueue`/`dequeue`/`peek` all use that same `T` so TypeScript won't let
 * you push the wrong type in or treat the result as the wrong type out.
 */
export class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  peek(): T | undefined {
    return this.items[0];
  }

  get size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}
