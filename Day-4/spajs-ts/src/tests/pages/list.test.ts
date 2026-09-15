import { renderListPage } from "../../pages/list.js";
import { createStore } from "../../store.js";
import { reducer, createInitialState } from "../../reducer.js";
import type { Store } from "../../types.js";

describe("renderListPage", () => {
  let store: Store;

  beforeEach(() => {
    document.body.innerHTML = "";
    store = createStore(createInitialState(), reducer);
  });

  it("shows an empty state when there are no tasks", () => {
    const element = renderListPage({ state: store.getState(), store, navigate: () => {}, params: {} });

    expect(element.querySelector(".empty-state")).not.toBeNull();
    expect(element.querySelectorAll(".card")).toHaveLength(0);
  });

  it("renders one card per task in state", () => {
    store.dispatch({
      type: "ADD_ITEM",
      payload: { id: "1", title: "Buy milk", done: false, createdAt: 0 }
    });
    store.dispatch({
      type: "ADD_ITEM",
      payload: { id: "2", title: "Walk dog", done: true, createdAt: 0 }
    });

    const element = renderListPage({ state: store.getState(), store, navigate: () => {}, params: {} });

    expect(element.querySelectorAll(".card")).toHaveLength(2);
    expect(element.textContent).toContain("Buy milk");
    expect(element.textContent).toContain("Walk dog");
  });

  it("shows the error banner when state.error is set", () => {
    store.dispatch({ type: "SET_ERROR", payload: "Could not load tasks" });

    const element = renderListPage({ state: store.getState(), store, navigate: () => {}, params: {} });

    // We just dispatched SET_ERROR above, so the error banner is rendered.
    expect(element.querySelector(".error-banner")!.textContent).toBe(
      "Could not load tasks"
    );
  });

  it("dispatches DELETE_ITEM when the delete button is clicked", () => {
    store.dispatch({
      type: "ADD_ITEM",
      payload: { id: "1", title: "Buy milk", done: false, createdAt: 0 }
    });

    const element = renderListPage({ state: store.getState(), store, navigate: () => {}, params: {} });
    const deleteButton = Array.from(element.querySelectorAll("button")).find(
      (btn) => btn.textContent === "Delete"
    );

    // We just rendered one task above, so a Delete button exists.
    deleteButton!.click();

    expect(store.getState().items).toHaveLength(0);
  });

  it("navigates to the detail route when a task title is clicked", () => {
    store.dispatch({
      type: "ADD_ITEM",
      payload: { id: "42", title: "Buy milk", done: false, createdAt: 0 }
    });

    let navigatedTo: string | null = null;
    const element = renderListPage({
      state: store.getState(),
      store,
      navigate: (path) => (navigatedTo = path),
      params: {}
    });

    // We just added the one task above, so its link is on the page.
    element.querySelector<HTMLElement>(".card-title--link")!.click();

    expect(navigatedTo).toBe("/detail/42");
  });

  it("dispatches UPDATE_ITEM to toggle done state", () => {
    store.dispatch({
      type: "ADD_ITEM",
      payload: { id: "1", title: "Buy milk", done: false, createdAt: 0 }
    });

    const element = renderListPage({ state: store.getState(), store, navigate: () => {}, params: {} });
    const toggleButton = Array.from(element.querySelectorAll("button")).find((btn) =>
      (btn.textContent ?? "").includes("Mark Done")
    );

    // We just rendered one task above, so the toggle button exists.
    toggleButton!.click();

    expect(store.getState().items[0].done).toBe(true);
  });

  it("disables the submit button while loading", () => {
    store.dispatch({ type: "SET_LOADING", payload: true });

    const element = renderListPage({ state: store.getState(), store, navigate: () => {}, params: {} });
    // The list page always renders one submit button in its add-task form.
    const submitButton = element.querySelector<HTMLButtonElement>('button[type="submit"]')!;

    expect(submitButton.disabled).toBe(true);
    expect(submitButton.textContent).toBe("Adding...");
  });

  it("adds a task through the form submit and clears the input", async () => {
    const element = renderListPage({ state: store.getState(), store, navigate: () => {}, params: {} });
    // The list page always renders exactly one input and one form.
    const input = element.querySelector<HTMLInputElement>("input")!;
    input.value = "New task";

    element.querySelector("form")!.dispatchEvent(new Event("submit", { cancelable: true }));
    expect(input.value).toBe("");

    await new Promise((resolve) => setTimeout(resolve, 300));

    expect(store.getState().items.some((item) => item.title === "New task")).toBe(true);
  });

  it("ignores the add-task form submit when the title is blank", () => {
    const element = renderListPage({ state: store.getState(), store, navigate: () => {}, params: {} });
    const input = element.querySelector<HTMLInputElement>("input")!;
    input.value = "   ";

    element.querySelector("form")!.dispatchEvent(new Event("submit", { cancelable: true }));

    expect(store.getState().items).toHaveLength(0);
  });

  it("produces the same structure for the same state (pure render)", () => {
    store.dispatch({
      type: "ADD_ITEM",
      payload: { id: "1", title: "Buy milk", done: false, createdAt: 0 }
    });

    const stateSnapshot = store.getState();
    const first = renderListPage({ state: stateSnapshot, store, navigate: () => {}, params: {} });
    const second = renderListPage({ state: stateSnapshot, store, navigate: () => {}, params: {} });

    expect(first.outerHTML).toBe(second.outerHTML);
  });
});
