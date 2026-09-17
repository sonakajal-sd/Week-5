import type { AppState, Action } from "./types.js";

/**
 * Builds a starting `AppState`, letting the caller override just the
 * fields it cares about. `Partial<AppState>` takes every required field on
 * `AppState` and makes it optional, so `overrides` can be `{ theme: "dark" }`
 * instead of a full state object — the spread below fills in the rest of
 * the defaults for whatever wasn't passed in.
 */
export function createInitialState(overrides: Partial<AppState> = {}): AppState {
  return {
    route: "/home",
    params: {},
    items: [],
    theme: "light",
    loading: false,
    error: null,
    ...overrides
  };
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "NAVIGATE":
      return {
        ...state,
        route: action.payload.path,
        params: action.payload.params
      };

    case "ADD_ITEM":
      return {
        ...state,
        items: [...state.items, action.payload]
      };

    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload } : item
        )
      };

    case "DELETE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload)
      };

    case "RESET_ITEMS":
      return {
        ...state,
        items: []
      };

    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload
      };

    case "SET_THEME":
      return {
        ...state,
        theme: action.payload
      };

    default:
      return state;
  }
}
