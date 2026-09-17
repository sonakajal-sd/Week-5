import { createRouter } from "./router.js";
import { createStore, createStorageMiddleware, loadPersistedState } from "./store.js";
import { reducer, createInitialState } from "./reducer.js";
import { renderHomePage } from "./pages/home.js";
import { renderListPage } from "./pages/list.js";
import { renderDetailPage } from "./pages/detail.js";
import { renderSettingsPage } from "./pages/settings.js";
import type { AppState, TaskItem } from "./types.js";

const STORAGE_KEY = "day5-task-manager-state";

function seedItems(): TaskItem[] {
  return [
    { id: "seed-1", title: "Plan sprint", done: false, createdAt: Date.now() },
    { id: "seed-2", title: "Write tests", done: false, createdAt: Date.now() }
  ];
}

/**
 * The slice of `AppState` we read back out of localStorage.
 *
 * `Pick<AppState, "items" | "theme">` takes just those two fields out of
 * the full `AppState` interface (so this type stays in sync if `AppState`
 * ever renames one of them), and `Partial<...>` then makes both optional —
 * a first-time visitor has nothing saved yet, so `persisted.items` and
 * `persisted.theme` may be `undefined`. Only "items" and "theme" are ever
 * saved (see the storage middleware below), so that's the only shape we
 * expect back.
 */
type PersistedState = Partial<Pick<AppState, "items" | "theme">>;

const persisted = loadPersistedState<PersistedState>(STORAGE_KEY, {});

const initialState = createInitialState({
  items: persisted.items ?? seedItems(),
  theme: persisted.theme ?? "light"
});

const store = createStore(initialState, reducer, [
  createStorageMiddleware(STORAGE_KEY, (state) => ({
    items: state.items,
    theme: state.theme
  }))
]);

function applyTheme(state: AppState): void {
  document.documentElement.setAttribute("data-theme", state.theme);
}

applyTheme(store.getState());
store.subscribe(applyTheme);

const router = createRouter(store);

router.register("/home", renderHomePage);
router.register("/list", renderListPage);
router.register("/detail/:id", renderDetailPage);
router.register("/settings", renderSettingsPage);

function renderNav(): void {
  const nav = document.getElementById("nav");
  if (!nav) return;

  nav.innerHTML = "";

  const links = [
    { href: "/home", label: "Home" },
    { href: "/list", label: "Tasks" },
    { href: "/settings", label: "Settings" }
  ];

  links.forEach(({ href, label }) => {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      router.navigate(href);
    });
    nav.append(link);
  });
}

renderNav();

const initialPath =
  window.location.pathname === "/" ? "/home" : window.location.pathname;

router.navigate(initialPath, { push: false });
