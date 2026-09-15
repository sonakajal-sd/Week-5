import { createStore } from "../store.js";
import { reducer, createInitialState } from "../reducer.js";

describe("typed dispatch (state manager)", () => {
  it("accepts a well-formed action and updates state with the right shape", () => {
    const store = createStore(createInitialState(), reducer);

    store.dispatch({
      type: "ADD_ITEM",
      payload: { id: "1", title: "Ship the feature", done: false, createdAt: 0 }
    });

    const state = store.getState();
    expect(state.items[0].title).toBe("Ship the feature");
    expect(typeof state.items[0].done).toBe("boolean");
    expect(typeof state.items[0].createdAt).toBe("number");
  });

  it("rejects a payload that's missing required fields — caught at compile time", () => {
    const store = createStore(createInitialState(), reducer);

    // @ts-expect-error - ADD_ITEM's payload must be a full TaskItem
    // (id, title, done, createdAt). This object is missing "done" and
    // "createdAt", so it must fail to compile.
    store.dispatch({ type: "ADD_ITEM", payload: { id: "1", title: "Oops" } });
  });

  it("rejects an action type that doesn't exist — caught at compile time", () => {
    const store = createStore(createInitialState(), reducer);

    // @ts-expect-error - "RENAME_ITEM" isn't part of the Action union in
    // src/types.ts, so this must fail to compile.
    store.dispatch({ type: "RENAME_ITEM", payload: { id: "1" } });
  });
});
