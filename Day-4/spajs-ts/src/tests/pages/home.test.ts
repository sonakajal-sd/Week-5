import { renderHomePage } from "../../pages/home.js";
import { createStore } from "../../store.js";
import { reducer, createInitialState } from "../../reducer.js";

describe("renderHomePage", () => {
  it("shows a no-tasks message when there are no items", () => {
    const store = createStore(createInitialState(), reducer);
    const element = renderHomePage({
      state: store.getState(),
      store,
      navigate: () => {},
      params: {}
    });
    expect(element.textContent).toContain("no tasks yet");
  });

  it("shows completed/total counts when items exist", () => {
    const store = createStore(
      createInitialState({
        items: [
          { id: "1", title: "Task 1", done: true, createdAt: 0 },
          { id: "2", title: "Task 2", done: false, createdAt: 0 }
        ]
      }),
      reducer
    );

    const element = renderHomePage({
      state: store.getState(),
      store,
      navigate: () => {},
      params: {}
    });

    expect(element.textContent).toContain("1 of 2 tasks completed");
  });

  it("navigates to /list when View Tasks is clicked", () => {
    const store = createStore(createInitialState(), reducer);
    let navigatedTo: string | null = null;
    const element = renderHomePage({
      state: store.getState(),
      store,
      navigate: (path) => (navigatedTo = path),
      params: {}
    });

    const button = Array.from(element.querySelectorAll("button")).find(
      (btn) => btn.textContent === "View Tasks"
    );
    // We just rendered this button ourselves, above — it's there.
    button!.click();

    expect(navigatedTo).toBe("/list");
  });

  it("navigates to /settings when Settings is clicked", () => {
    const store = createStore(createInitialState(), reducer);
    let navigatedTo: string | null = null;
    const element = renderHomePage({
      state: store.getState(),
      store,
      navigate: (path) => (navigatedTo = path),
      params: {}
    });

    const button = Array.from(element.querySelectorAll("button")).find(
      (btn) => btn.textContent === "Settings"
    );
    button!.click();

    expect(navigatedTo).toBe("/settings");
  });
});
