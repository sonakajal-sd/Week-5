import { renderSettingsPage } from "../../pages/settings.js";
import { createStore } from "../../store.js";
import { reducer, createInitialState } from "../../reducer.js";
import type { Store } from "../../types.js";

describe("renderSettingsPage", () => {
  let store: Store;

  beforeEach(() => {
    document.body.innerHTML = "";
    store = createStore(createInitialState(), reducer);
  });

  it("shows the current theme", () => {
    const element = renderSettingsPage({ state: store.getState(), store, navigate: () => {}, params: {} });
    expect(element.textContent).toContain("Current theme: light");
  });

  it("dispatches SET_THEME when the theme button is clicked", () => {
    const element = renderSettingsPage({ state: store.getState(), store, navigate: () => {}, params: {} });
    const themeButton = Array.from(element.querySelectorAll("button")).find((btn) =>
      (btn.textContent ?? "").includes("Dark Mode")
    );

    // The settings page always renders the theme toggle button.
    themeButton!.click();

    expect(store.getState().theme).toBe("dark");
  });

  it("switches back to light mode when the theme is already dark", () => {
    const darkStore = createStore(createInitialState({ theme: "dark" }), reducer);
    const element = renderSettingsPage({
      state: darkStore.getState(),
      store: darkStore,
      navigate: () => {},
      params: {}
    });

    expect(element.textContent).toContain("Current theme: dark");

    const themeButton = Array.from(element.querySelectorAll("button")).find((btn) =>
      (btn.textContent ?? "").includes("Light Mode")
    );
    themeButton!.click();

    expect(darkStore.getState().theme).toBe("light");
  });

  it("opens a confirmation modal and clears tasks on confirm", () => {
    store.dispatch({
      type: "ADD_ITEM",
      payload: { id: "1", title: "Task", done: false, createdAt: 0 }
    });

    const element = renderSettingsPage({ state: store.getState(), store, navigate: () => {}, params: {} });
    document.body.append(element);

    const clearButton = Array.from(element.querySelectorAll("button")).find(
      (btn) => btn.textContent === "Clear All Tasks"
    );
    // The settings page always renders the "Clear All Tasks" button.
    clearButton!.click();

    const confirmButton = Array.from(
      document.querySelectorAll<HTMLButtonElement>(".modal-actions button")
    ).find((btn) => btn.textContent === "Clear");
    // Clicking Clear All Tasks just opened the confirmation modal above.
    confirmButton!.click();

    expect(store.getState().items).toHaveLength(0);
  });
});
