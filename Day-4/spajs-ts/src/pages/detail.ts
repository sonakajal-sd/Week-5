import { Button } from "@components/button.js";
import { Modal } from "@components/modal.js";
import { runAsync, delay } from "../async.js";
import type { PageProps } from "../types.js";

export function renderDetailPage({ state, store, navigate, params }: PageProps): HTMLElement {
  const section = document.createElement("section");
  section.className = "page detail-page";

  const item = state.items.find((task) => task.id === params.id);

  if (!item) {
    const heading = document.createElement("h2");
    heading.textContent = "Task not found";
    const back = Button({ text: "Back to Tasks", onClick: () => navigate("/list") });
    section.append(heading, back);
    return section;
  }

  const heading = document.createElement("h2");
  heading.textContent = item.title;
  section.append(heading);

  if (state.error) {
    const error = document.createElement("p");
    error.className = "error-banner";
    error.textContent = state.error;
    section.append(error);
  }

  const status = document.createElement("p");
  status.className = "detail-status";
  status.textContent = item.done ? "Status: Done" : "Status: Pending";
  section.append(status);

  const form = document.createElement("form");
  form.className = "edit-task-form";

  const input = document.createElement("input");
  input.type = "text";
  input.value = item.title;
  input.setAttribute("aria-label", "Task title");

  const saveButton = Button({
    text: state.loading ? "Saving..." : "Save",
    type: "submit",
    disabled: state.loading
  });

  form.append(input, saveButton);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = input.value.trim();
    if (!title) return;

    runAsync(store, async () => {
      await delay(200);
      store.dispatch({ type: "UPDATE_ITEM", payload: { id: item.id, title } });
    });
  });

  section.append(form);

  const actions = document.createElement("div");
  actions.className = "detail-actions";

  const toggleButton = Button({
    text: item.done ? "Mark Pending" : "Mark Done",
    variant: "secondary",
    onClick: () =>
      store.dispatch({
        type: "UPDATE_ITEM",
        payload: { id: item.id, done: !item.done }
      })
  });

  const deleteButton = Button({
    text: "Delete",
    variant: "danger",
    onClick: () => {
      const modal = Modal({
        title: "Delete task?",
        content: `This will permanently delete "${item.title}".`,
        confirmText: "Delete",
        onConfirm: () => {
          store.dispatch({ type: "DELETE_ITEM", payload: item.id });
          navigate("/list");
        }
      });
      document.body.append(modal);
    }
  });

  const backButton = Button({ text: "Back", onClick: () => navigate("/list") });

  actions.append(toggleButton, deleteButton, backButton);
  section.append(actions);

  return section;
}
