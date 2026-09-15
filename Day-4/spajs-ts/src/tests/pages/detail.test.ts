import { renderDetailPage } from "../../pages/detail.js";
import { createStore } from "../../store.js";
import { reducer, createInitialState } from "../../reducer.js";
import type { Store } from "../../types.js";

describe("renderDetailPage", () => {
  let store: Store;

  beforeEach(() => {
    document.body.innerHTML = "";
    store = createStore(
      createInitialState({
        items: [{ id: "1", title: "Buy milk", done: false, createdAt: 0 }]
      }),
      reducer
    );
  });

  it("renders the task matching the id param", () => {
    const element = renderDetailPage({
      state: store.getState(),
      store,
      navigate: () => {},
      params: { id: "1" }
    });

    // The page always renders exactly one h2 and one status paragraph.
    expect(element.querySelector("h2")!.textContent).toBe("Buy milk");
    expect(element.querySelector(".detail-status")!.textContent).toBe("Status: Pending");
  });

  it("shows 'Status: Done' and a 'Mark Pending' button for a completed task", () => {
    const doneStore = createStore(
      createInitialState({
        items: [{ id: "1", title: "Buy milk", done: true, createdAt: 0 }]
      }),
      reducer
    );

    const element = renderDetailPage({
      state: doneStore.getState(),
      store: doneStore,
      navigate: () => {},
      params: { id: "1" }
    });

    expect(element.querySelector(".detail-status")!.textContent).toBe("Status: Done");
    const buttonTexts = Array.from(element.querySelectorAll("button")).map((b) => b.textContent);
    expect(buttonTexts).toContain("Mark Pending");
  });

  it("shows 'Saving...' and disables the save button while loading", () => {
    store.dispatch({ type: "SET_LOADING", payload: true });

    const element = renderDetailPage({
      state: store.getState(),
      store,
      navigate: () => {},
      params: { id: "1" }
    });

    const saveButton = element.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    expect(saveButton.textContent).toBe("Saving...");
    expect(saveButton.disabled).toBe(true);
  });

  it("ignores the edit form submit when the title is blank", async () => {
    const element = renderDetailPage({
      state: store.getState(),
      store,
      navigate: () => {},
      params: { id: "1" }
    });

    const input = element.querySelector<HTMLInputElement>("input")!;
    input.value = "   ";
    element.querySelector("form")!.dispatchEvent(new Event("submit", { cancelable: true }));

    await new Promise((resolve) => setTimeout(resolve, 250));

    expect(store.getState().items[0].title).toBe("Buy milk");
  });

  it("shows a not-found message for an unknown id", () => {
    const element = renderDetailPage({
      state: store.getState(),
      store,
      navigate: () => {},
      params: { id: "does-not-exist" }
    });

    expect(element.querySelector("h2")!.textContent).toBe("Task not found");
  });

  it("dispatches UPDATE_ITEM to toggle done state", () => {
    const element = renderDetailPage({
      state: store.getState(),
      store,
      navigate: () => {},
      params: { id: "1" }
    });

    const toggleButton = Array.from(element.querySelectorAll("button")).find((btn) =>
      (btn.textContent ?? "").includes("Mark Done")
    );

    // The task exists (seeded in beforeEach), so the toggle button is there.
    toggleButton!.click();

    expect(store.getState().items[0].done).toBe(true);
  });

  it("navigates back to the list when Back is clicked", () => {
    let navigatedTo: string | null = null;
    const element = renderDetailPage({
      state: store.getState(),
      store,
      navigate: (path) => (navigatedTo = path),
      params: { id: "1" }
    });

    const backButton = Array.from(element.querySelectorAll("button")).find(
      (btn) => btn.textContent === "Back"
    );

    // The detail page always renders a Back button.
    backButton!.click();

    expect(navigatedTo).toBe("/list");
  });

  it("shows the error banner when state.error is set", () => {
    store.dispatch({ type: "SET_ERROR", payload: "Save failed" });

    const element = renderDetailPage({
      state: store.getState(),
      store,
      navigate: () => {},
      params: { id: "1" }
    });

    // We just dispatched SET_ERROR above, so the banner is rendered.
    expect(element.querySelector(".error-banner")!.textContent).toBe("Save failed");
  });

  it("opens a confirmation modal and deletes then navigates on confirm", () => {
    let navigatedTo: string | null = null;
    const element = renderDetailPage({
      state: store.getState(),
      store,
      navigate: (path) => (navigatedTo = path),
      params: { id: "1" }
    });
    document.body.append(element);

    const deleteButton = Array.from(element.querySelectorAll("button")).find(
      (btn) => btn.textContent === "Delete"
    );
    // The task exists, so the Delete button is there.
    deleteButton!.click();

    const confirmButton = Array.from(
      document.querySelectorAll<HTMLButtonElement>(".modal-actions button")
    ).find((btn) => btn.textContent === "Delete");
    // Clicking Delete just opened the confirmation modal above.
    confirmButton!.click();

    expect(store.getState().items).toHaveLength(0);
    expect(navigatedTo).toBe("/list");
  });

  it("submits the edit form and dispatches an updated title", async () => {
    const element = renderDetailPage({
      state: store.getState(),
      store,
      navigate: () => {},
      params: { id: "1" }
    });

    // The detail page always renders exactly one input and one form.
    const input = element.querySelector<HTMLInputElement>("input")!;
    input.value = "Buy oat milk";
    element.querySelector("form")!.dispatchEvent(new Event("submit", { cancelable: true }));

    await new Promise((resolve) => setTimeout(resolve, 250));

    expect(store.getState().items[0].title).toBe("Buy oat milk");
  });
});
