import { createRouter, matchPath } from "../router.js";
import { createStore } from "../store.js";
import { reducer, createInitialState } from "../reducer.js";
import { renderHomePage } from "../pages/home.js";
import { renderDetailPage } from "../pages/detail.js";
import type { Store } from "../types.js";

describe("matchPath", () => {
  it("matches a static route", () => {
    expect(matchPath("/home", "/home")).toEqual({});
  });

  it("returns null when segment counts differ", () => {
    expect(matchPath("/home", "/home/extra")).toBeNull();
  });

  it("returns null when static segments differ", () => {
    expect(matchPath("/list", "/home")).toBeNull();
  });

  it("extracts a single dynamic param", () => {
    expect(matchPath("/detail/:id", "/detail/42")).toEqual({ id: "42" });
  });

  it("decodes encoded dynamic params", () => {
    expect(matchPath("/detail/:id", "/detail/a%20b")).toEqual({ id: "a b" });
  });
});

describe("createRouter", () => {
  let store: Store;
  let router: ReturnType<typeof createRouter>;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    history.replaceState({}, "", "/");

    store = createStore(createInitialState(), reducer);
    router = createRouter(store);

    router.register("/home", renderHomePage);
    router.register("/detail/:id", renderDetailPage);
  });

  it("navigates to a route and updates the URL", () => {
    router.navigate("/home");

    expect(window.location.pathname).toBe("/home");
  });

  it("renders the matching component into the root element", () => {
    router.navigate("/home");

    // beforeEach always inserts <div id="app">, so this is never null here.
    const app = document.getElementById("app")!;
    expect(app.textContent).toContain("Welcome back");
  });

  it("updates the route slice of state on navigate", () => {
    router.navigate("/home");

    expect(store.getState().route).toBe("/home");
  });

  it("extracts dynamic segment params and passes them to the component", () => {
    store.dispatch({
      type: "ADD_ITEM",
      payload: { id: "7", title: "Buy milk", done: false, createdAt: Date.now() }
    });

    router.navigate("/detail/7");

    expect(store.getState().params).toEqual({ id: "7" });
    // beforeEach always inserts <div id="app">, so this is never null here.
    const app = document.getElementById("app")!;
    expect(app.textContent).toContain("Buy milk");
  });

  it("renders a not-found section for unregistered routes", () => {
    router.navigate("/does-not-exist");

    // beforeEach always inserts <div id="app">, so this is never null here.
    const app = document.getElementById("app")!;
    expect(app.querySelector(".not-found")).not.toBeNull();
  });

  it("does nothing (and does not throw) when the root element is missing", () => {
    document.body.innerHTML = "";

    expect(() => router.navigate("/home")).not.toThrow();
  });

  it("treats a query-string-only path as the root path", () => {
    router.navigate("?tab=1");

    expect(store.getState().params).toEqual({});
  });

  it("navigates when the browser back/forward buttons fire a popstate event", () => {
    router.navigate("/home");
    history.pushState({}, "", "/list");

    window.dispatchEvent(new PopStateEvent("popstate"));

    expect(store.getState().route).toBe("/list");
  });
});
