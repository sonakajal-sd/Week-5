import { Button } from "@components/button.js";
import { Modal } from "@components/modal.js";
import type { PageProps } from "../types.js";

export function renderSettingsPage({ state, store }: PageProps): HTMLElement {
  const section = document.createElement("section");
  section.className = "page settings-page";

  const heading = document.createElement("h2");
  heading.textContent = "Settings";
  section.append(heading);

  const themeRow = document.createElement("p");
  themeRow.textContent = `Current theme: ${state.theme}`;
  section.append(themeRow);

  const themeButton = Button({
    text: state.theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode",
    onClick: () =>
      store.dispatch({
        type: "SET_THEME",
        payload: state.theme === "light" ? "dark" : "light"
      })
  });
  section.append(themeButton);

  const clearButton = Button({
    text: "Clear All Tasks",
    variant: "danger",
    onClick: () => {
      const modal = Modal({
        title: "Clear all tasks?",
        content: "This cannot be undone.",
        confirmText: "Clear",
        onConfirm: () => store.dispatch({ type: "RESET_ITEMS" })
      });
      document.body.append(modal);
    }
  });
  section.append(clearButton);

  return section;
}
