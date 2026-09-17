export interface TaskItem {
  id: string;
  title: string;
  done: boolean;
  createdAt: number;
}

export interface AppState {
  route: string;
  params: Record<string, string>;
  items: TaskItem[];
  theme: string;
  loading: boolean;
  error: string | null;
}

/**
 * A discriminated union of every action the reducer knows how to handle.
 *
 * Each member has a `type` string literal plus its own `payload` shape.
 * Because every branch shares the same `type` field name, TypeScript can
 * narrow the whole object just by checking `action.type` (e.g. inside a
 * `switch`) — inside the `"ADD_ITEM"` branch, `action.payload` is known to
 * be a `TaskItem` and nothing else. This is what gives `store.dispatch(...)`
 * autocomplete and compile-time safety: passing a typo'd `type` or the
 * wrong `payload` shape is a type error instead of a runtime bug.
 */
export type Action =
  | { type: "NAVIGATE"; payload: { path: string; params: Record<string, string> } }
  | { type: "ADD_ITEM"; payload: TaskItem }
  // `Partial<TaskItem> & { id: string }`: every TaskItem field is optional
  // (Partial) EXCEPT `id`, which is required again by intersecting it back
  // in. This lets a caller update just one field (e.g. only `done`) while
  // TypeScript still forces them to say which item they mean.
  | { type: "UPDATE_ITEM"; payload: Partial<TaskItem> & { id: string } }
  | { type: "DELETE_ITEM"; payload: string }
  | { type: "RESET_ITEMS" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_THEME"; payload: string };

export interface Store {
  getState: () => AppState;
  dispatch: (action: Action) => Action;
  subscribe: (listener: (state: AppState, action?: Action) => void) => () => void;
}

export interface PageProps {
  state: AppState;
  store: Store;
  navigate: (path: string, options?: { push?: boolean }) => void;
  params: Record<string, string>;
}

/**
 * The shape every page (home, list, detail, settings) must match: a plain
 * function that takes `PageProps` and returns the DOM element to render.
 * Defining this as a type (instead of writing the function signature out
 * at every call site) means the router can hold pages in a
 * `Record<string, PageComponent>` and call any of them the same way.
 */
export type PageComponent = (props: PageProps) => HTMLElement;
