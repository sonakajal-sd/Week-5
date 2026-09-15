import { reducer, createInitialState } from "../reducer.js";
import type { Action } from "../types.js";

describe("reducer", () => {
  it("handles NAVIGATE", () => {
    const state = reducer(createInitialState(), {
      type: "NAVIGATE",
      payload: { path: "/list", params: {} }
    });

    expect(state.route).toBe("/list");
  });

  it("handles ADD_ITEM", () => {
    const state = reducer(createInitialState(), {
      type: "ADD_ITEM",
      payload: { id: "1", title: "Task", done: false, createdAt: 0 }
    });

    expect(state.items).toHaveLength(1);
  });

  it("handles UPDATE_ITEM", () => {
    const initial = createInitialState({
      items: [{ id: "1", title: "Task", done: false, createdAt: 0 }]
    });

    const state = reducer(initial, {
      type: "UPDATE_ITEM",
      payload: { id: "1", done: true }
    });

    expect(state.items[0].done).toBe(true);
    expect(state.items[0].title).toBe("Task");
  });

  it("leaves other items untouched when updating one by id", () => {
    const initial = createInitialState({
      items: [
        { id: "1", title: "Task 1", done: false, createdAt: 0 },
        { id: "2", title: "Task 2", done: false, createdAt: 0 }
      ]
    });

    const state = reducer(initial, {
      type: "UPDATE_ITEM",
      payload: { id: "1", done: true }
    });

    expect(state.items[0].done).toBe(true);
    expect(state.items[1]).toEqual(initial.items[1]);
  });

  it("handles DELETE_ITEM", () => {
    const initial = createInitialState({
      items: [{ id: "1", title: "Task", done: false, createdAt: 0 }]
    });

    const state = reducer(initial, { type: "DELETE_ITEM", payload: "1" });

    expect(state.items).toHaveLength(0);
  });

  it("handles RESET_ITEMS", () => {
    const initial = createInitialState({
      items: [{ id: "1", title: "Task", done: false, createdAt: 0 }]
    });

    const state = reducer(initial, { type: "RESET_ITEMS" });

    expect(state.items).toHaveLength(0);
  });

  it("handles SET_LOADING and SET_ERROR", () => {
    let state = reducer(createInitialState(), { type: "SET_LOADING", payload: true });
    expect(state.loading).toBe(true);

    state = reducer(state, { type: "SET_ERROR", payload: "boom" });
    expect(state.error).toBe("boom");
  });

  it("handles SET_THEME", () => {
    const state = reducer(createInitialState(), { type: "SET_THEME", payload: "dark" });
    expect(state.theme).toBe("dark");
  });

  it("returns the same state for unknown actions", () => {
    const initial = createInitialState();
    // "UNKNOWN" isn't a real action type — Action is a closed union, so
    // TypeScript (correctly) won't let us pass it normally. We still want
    // to test the reducer's default case, since actions could come from
    // untyped JS callers at runtime, so we cast past the check here on
    // purpose. Last resort, and only in a test.
    const state = reducer(initial, { type: "UNKNOWN" } as unknown as Action);

    expect(state).toBe(initial);
  });
});
