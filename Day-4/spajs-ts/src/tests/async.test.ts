import { runAsync } from "../async.js";
import { createStore } from "../store.js";
import { reducer, createInitialState } from "../reducer.js";

describe("runAsync", () => {
  it("sets loading true then false around a successful task", async () => {
    const store = createStore(createInitialState(), reducer);
    const seenLoading: boolean[] = [];

    store.subscribe((state) => seenLoading.push(state.loading));

    await runAsync(store, async () => {
      expect(store.getState().loading).toBe(true);
    });

    expect(store.getState().loading).toBe(false);
    expect(store.getState().error).toBeNull();
    expect(seenLoading).toContain(true);
  });

  it("sets an error message when the task throws", async () => {
    const store = createStore(createInitialState(), reducer);

    await runAsync(store, async () => {
      throw new Error("network down");
    });

    expect(store.getState().loading).toBe(false);
    expect(store.getState().error).toBe("network down");
  });

  it("falls back to a generic error message when something non-Error is thrown", async () => {
    const store = createStore(createInitialState(), reducer);

    await runAsync(store, async () => {
      throw "just a string, not an Error";
    });

    expect(store.getState().error).toBe("Something went wrong");
  });
});
