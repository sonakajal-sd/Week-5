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

// A union of every action the reducer knows how to handle.
// This is how we get autocomplete + safety when calling store.dispatch(...).
export type Action =
  | { type: "NAVIGATE"; payload: { path: string; params: Record<string, string> } }
  | { type: "ADD_ITEM"; payload: TaskItem }
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

export type PageComponent = (props: PageProps) => HTMLElement;
