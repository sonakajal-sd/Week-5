import { Button } from "@components/button.js";
import type { PageProps } from "../types.js";

export function renderHomePage({ state, navigate }: PageProps): HTMLElement {
  const section = document.createElement("section");
  section.className = "page home-page";

  const heading = document.createElement("h2");
  heading.textContent = "Welcome back";
  section.append(heading);

  const total = state.items.length;
  const done = state.items.filter((item) => item.done).length;

  const stats = document.createElement("p");
  stats.className = "home-stats";
  stats.textContent = total
    ? `${done} of ${total} tasks completed`
    : "You have no tasks yet.";
  section.append(stats);

  const actions = document.createElement("div");
  actions.className = "home-actions";
  actions.append(
    Button({ text: "View Tasks", onClick: () => navigate("/list") }),
    Button({
      text: "Settings",
      variant: "secondary",
      onClick: () => navigate("/settings")
    })
  );
  section.append(actions);

  return section;
}
