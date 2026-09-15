import { Button } from "@components/button.js";
import { Card } from "@components/card.js";
import { runAsync, delay } from "../async.js";
import { generateId } from "@utils";
import type { PageProps } from "../types.js";

export function renderListPage({ state, store, navigate }: PageProps): HTMLElement {
  const section = document.createElement("section");
  section.className = "page list-page";

  const heading = document.createElement("h2");
  heading.textContent = "Tasks";
  section.append(heading);

  if (state.error) {
    const error = document.createElement("p");
    error.className = "error-banner";
    error.textContent = state.error;
    section.append(error);
  }

  const form = document.createElement("form");
  form.className = "add-task-form";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "New task title";
  input.setAttribute("aria-label", "New task title");

  const submitButton = Button({
    text: state.loading ? "Adding..." : "Add Task",
    type: "submit",
    disabled: state.loading
  });

  form.append(input, submitButton);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = input.value.trim();
    if (!title) return;

    runAsync(store, async () => {
      await delay(250);
      store.dispatch({
        type: "ADD_ITEM",
        payload: { id: generateId(), title, done: false, createdAt: Date.now() }
      });
    });

    input.value = "";
  });

  section.append(form);

  const list = document.createElement("div");
  list.className = "task-list";

  if (state.items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No tasks yet. Add one above.";
    list.append(empty);
  }

  state.items.forEach((item) => {
    const card = Card({
      title: item.done ? `✅ ${item.title}` : item.title,
      content: `Created ${new Date(item.createdAt).toLocaleString()}`,
      onClick: () => navigate(`/detail/${item.id}`),
      actions: [
        {
          text: item.done ? "Mark Pending" : "Mark Done",
          variant: "secondary",
          onClick: () =>
            store.dispatch({
              type: "UPDATE_ITEM",
              payload: { id: item.id, done: !item.done }
            })
        },
        {
          text: "Delete",
          variant: "danger",
          onClick: () =>
            store.dispatch({ type: "DELETE_ITEM", payload: item.id })
        }
      ]
    });

    list.append(card);
  });

  section.append(list);

  return section;
}
