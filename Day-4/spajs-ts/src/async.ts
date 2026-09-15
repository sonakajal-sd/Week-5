import type { Store } from "./types.js";

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runAsync(store: Store, task: () => Promise<void>): Promise<void> {
  store.dispatch({ type: "SET_ERROR", payload: null });
  store.dispatch({ type: "SET_LOADING", payload: true });

  try {
    await task();
  } catch (err) {
    store.dispatch({
      type: "SET_ERROR",
      payload: err instanceof Error ? err.message : "Something went wrong"
    });
  } finally {
    store.dispatch({ type: "SET_LOADING", payload: false });
  }
}
