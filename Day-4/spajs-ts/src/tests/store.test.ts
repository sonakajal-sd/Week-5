import { createStore, createStorageMiddleware, loadPersistedState } from "../store.js";
import type { Middleware } from "../store.js";
import { reducer, createInitialState } from "../reducer.js";

describe("createStore", () => {
  it("returns getState, dispatch and subscribe", () => {
    const store = createStore(createInitialState(), reducer);

    expect(store).toHaveProperty("getState");
    expect(store).toHaveProperty("dispatch");
    expect(store).toHaveProperty("subscribe");
  });

  it("updates state when an action is dispatched", () => {
    const store = createStore(createInitialState(), reducer);

    store.dispatch({
      type: "ADD_ITEM",
      payload: { id: "1", title: "Task", done: false, createdAt: 0 }
    });

    expect(store.getState().items).toHaveLength(1);
    expect(store.getState().items[0].title).toBe("Task");
  });

  it("notifies subscribers after dispatch", () => {
    const store = createStore(createInitialState(), reducer);
    const listener = jest.fn();

    store.subscribe(listener);
    store.dispatch({ type: "SET_LOADING", payload: true });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(store.getState(), {
      type: "SET_LOADING",
      payload: true
    });
  });

  it("allows unsubscribing", () => {
    const store = createStore(createInitialState(), reducer);
    const listener = jest.fn();

    const unsubscribe = store.subscribe(listener);
    unsubscribe();
    store.dispatch({ type: "SET_LOADING", payload: true });

    expect(listener).not.toHaveBeenCalled();
  });

  it("runs dispatch through provided middleware", () => {
    const calls: string[] = [];
    const loggingMiddleware: Middleware = () => (next) => (action) => {
      calls.push(action.type);
      return next(action);
    };

    const store = createStore(createInitialState(), reducer, [loggingMiddleware]);
    store.dispatch({ type: "SET_LOADING", payload: true });

    expect(calls).toEqual(["SET_LOADING"]);
  });
});

describe("storage middleware + persistence", () => {
  const KEY = "test-day5-state";

  beforeEach(() => {
    localStorage.clear();
  });

  it("persists selected state to localStorage on every dispatch", () => {
    const store = createStore(createInitialState(), reducer, [
      createStorageMiddleware(KEY, (state) => ({ items: state.items }))
    ]);

    store.dispatch({
      type: "ADD_ITEM",
      payload: { id: "1", title: "Persisted", done: false, createdAt: 0 }
    });

    // localStorage.getItem() returns "string | null", but we just dispatched
    // an action, so the storage middleware has definitely written a value —
    // we're certain it's there, so a non-null assertion is safe here.
    const raw = JSON.parse(localStorage.getItem(KEY)!);
    expect(raw.items).toHaveLength(1);
    expect(raw.items[0].title).toBe("Persisted");
  });

  it("loadPersistedState reads back what was stored", () => {
    localStorage.setItem(KEY, JSON.stringify({ items: [{ id: "1" }] }));

    const loaded = loadPersistedState<{ items: Array<{ id: string }> }>(KEY, { items: [] });
    expect(loaded.items).toHaveLength(1);
  });

  it("loadPersistedState falls back when nothing is stored", () => {
    const loaded = loadPersistedState("missing-key", { items: [] });
    expect(loaded).toEqual({ items: [] });
  });

  it("createStorageMiddleware persists the whole state when no select function is given", () => {
    const store = createStore(createInitialState(), reducer, [
      createStorageMiddleware(KEY)
    ]);

    store.dispatch({ type: "SET_THEME", payload: "dark" });

    const raw = JSON.parse(localStorage.getItem(KEY)!);
    expect(raw.theme).toBe("dark");
  });

  it("warns instead of throwing when localStorage.setItem fails", () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota exceeded");
    });

    const store = createStore(createInitialState(), reducer, [
      createStorageMiddleware(KEY)
    ]);

    expect(() => store.dispatch({ type: "SET_THEME", payload: "dark" })).not.toThrow();
    expect(warnSpy).toHaveBeenCalled();

    setItemSpy.mockRestore();
    warnSpy.mockRestore();
  });

  it("loadPersistedState falls back when the stored value isn't valid JSON", () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    localStorage.setItem(KEY, "{not valid json");

    const loaded = loadPersistedState(KEY, { items: [] as unknown[] });

    expect(loaded).toEqual({ items: [] });
    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });
});
