import type { AppState, Action } from "./types.js";

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
