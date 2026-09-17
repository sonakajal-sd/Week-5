import type { AppState, Action, Store } from "./types.js";

type Listener = (state: AppState, action?: Action) => void;
type Dispatch = (action: Action) => Action;
export type Middleware = (store: Store) => (next: Dispatch) => Dispatch;

export function createStore(
  initialState: AppState,
  reducerFn: (state: AppState, action: Action) => AppState,
  middlewares: Middleware[] = []
): Store {
  let state = initialState;
  let listeners: Listener[] = [];

  function getState(): AppState {
    return state;
  }

  function baseDispatch(action: Action): Action {
    state = reducerFn(state, action);
    listeners.slice().forEach((listener) => listener(state, action));
    return action;
  }

  function subscribe(listener: Listener): () => void {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }

  // dispatch starts out as baseDispatch just so `store` has every property
  // Store requires right away, then gets wrapped by middleware below.
  const store: Store = { getState, subscribe, dispatch: baseDispatch };

  store.dispatch = middlewares.reduceRight(
    (next, middleware) => middleware(store)(next),
    baseDispatch
  );

  return store;
}

export function createStorageMiddleware(
  key: string,
  select: (state: AppState) => unknown = (state) => state
): Middleware {
  return (store) => (next) => (action) => {
    const result = next(action);

    try {
      localStorage.setItem(key, JSON.stringify(select(store.getState())));
    } catch (err) {
      console.warn("Failed to persist state to localStorage", err);
    }

    return result;
  };
}

/**
 * Reads `key` from localStorage and parses it as `T`, or returns `fallback`
 * if nothing is stored (or parsing fails). `fallback: T` is what ties the
 * generic to a real type at the call site — e.g. passing a `PersistedState`
 * fallback makes TypeScript infer `T = PersistedState`, so the parsed JSON
 * is treated as that shape without needing an explicit `<PersistedState>`.
 */
export function loadPersistedState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (err) {
    console.warn("Failed to load persisted state from localStorage", err);
    return fallback;
  }
}
