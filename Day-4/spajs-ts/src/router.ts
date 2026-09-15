import type { Store, PageComponent } from "./types.js";

export function matchPath(
  routePath: string,
  actualPath: string
): Record<string, string> | null {
  const routeParts = routePath.split("/").filter(Boolean);
  const actualParts = actualPath.split("/").filter(Boolean);

  if (routeParts.length !== actualParts.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < routeParts.length; i++) {
    const routePart = routeParts[i];
    const actualPart = actualParts[i];

    if (routePart.startsWith(":")) {
      params[routePart.slice(1)] = decodeURIComponent(actualPart);
    } else if (routePart !== actualPart) {
      return null;
    }
  }

  return params;
}

interface Route {
  path: string;
  component: PageComponent;
}

export function createRouter(store: Store, rootId = "app") {
  const routes: Route[] = [];
  let currentPath: string | null = null;

  function register(path: string, component: PageComponent): void {
    routes.push({ path, component });
  }

  function findMatch(path: string): { route: Route; params: Record<string, string> } | null {
    const cleanPath = path.split("?")[0].split("#")[0] || "/";

    for (const route of routes) {
      const params = matchPath(route.path, cleanPath);
      if (params) {
        return { route, params };
      }
    }

    return null;
  }

  function renderNotFound(path: string): HTMLElement {
    const section = document.createElement("section");
    section.className = "page not-found";
    section.textContent = `No route matches "${path}"`;
    return section;
  }

  function render(): void {
    if (currentPath === null) {
      return;
    }

    const root = document.getElementById(rootId);
    if (!root) {
      return;
    }

    const matched = findMatch(currentPath);

    if (!matched) {
      root.replaceChildren(renderNotFound(currentPath));
      return;
    }

    const element = matched.route.component({
      state: store.getState(),
      store,
      navigate,
      params: matched.params
    });

    element.classList.add("page-transition");
    root.replaceChildren(element);
  }

  function navigate(path: string, { push = true }: { push?: boolean } = {}): void {
    currentPath = path;
    const matched = findMatch(path);

    if (push) {
      history.pushState({}, "", path);
    }

    store.dispatch({
      type: "NAVIGATE",
      payload: {
        path,
        params: matched ? matched.params : {}
      }
    });
  }

  store.subscribe(() => render());

  window.addEventListener("popstate", () => {
    navigate(window.location.pathname, { push: false });
  });

  return { register, navigate, matchPath: findMatch };
}
