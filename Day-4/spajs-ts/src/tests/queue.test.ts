import { Queue } from "../queue.js";

describe("Queue<T>", () => {
  it("stores and retrieves strings in FIFO order", () => {
    const queue = new Queue<string>();
    queue.enqueue("first");
    queue.enqueue("second");

    expect(queue.dequeue()).toBe("first");
    expect(queue.dequeue()).toBe("second");
    expect(queue.dequeue()).toBeUndefined();
  });

  it("stores and retrieves numbers", () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);

    expect(queue.dequeue()).toBe(1);
    expect(queue.size).toBe(1);
  });

  interface Task {
    id: string;
    title: string;
  }

  it("stores and retrieves objects", () => {
    const queue = new Queue<Task>();
    const task: Task = { id: "1", title: "Write tests" };
    queue.enqueue(task);

    expect(queue.peek()).toEqual(task);
    expect(queue.isEmpty()).toBe(false);
  });

  it("only accepts the type it was created with — this is checked at compile time, not runtime", () => {
    const queue = new Queue<number>();
    queue.enqueue(42);

    // @ts-expect-error - queue is a Queue<number>, so enqueue() only takes
    // numbers. Passing a string here must fail to compile. If someone
    // removes the generic and this line stops erroring, this test fails
    // to compile too (an unused @ts-expect-error is itself an error),
    // which is how we prove the type-safety actually exists.
    queue.enqueue("not a number");
  });
});
