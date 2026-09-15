import { Card } from "@components/card.js";

describe("Card", () => {
  it("uses sensible defaults when called with no props at all", () => {
    const card = Card();

    expect(card.querySelector(".card-title")!.textContent).toBe("");
    expect(card.querySelector(".card-content")!.textContent).toBe("");
    expect(card.querySelector(".card-actions")).toBeNull();
  });

  it("renders a plain card with no link and no actions", () => {
    const card = Card({ title: "Title", content: "Body text" });

    expect(card.querySelector(".card-title")!.textContent).toBe("Title");
    expect(card.querySelector(".card-content")!.textContent).toBe("Body text");
    expect(card.querySelector(".card-title--link")).toBeNull();
    expect(card.querySelector(".card-actions")).toBeNull();
  });

  it("makes the title clickable when onClick is given", () => {
    const onClick = jest.fn();
    const card = Card({ title: "Title", onClick });

    card.querySelector<HTMLElement>(".card-title--link")!.click();

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("also triggers onClick when Enter is pressed on the title", () => {
    const onClick = jest.fn();
    const card = Card({ title: "Title", onClick });

    card.querySelector(".card-title--link")!.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
    );

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not trigger onClick for other keys", () => {
    const onClick = jest.fn();
    const card = Card({ title: "Title", onClick });

    card.querySelector(".card-title--link")!.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Tab", bubbles: true })
    );

    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders one button per action", () => {
    const onFirst = jest.fn();
    const card = Card({
      title: "Title",
      actions: [
        { text: "First", onClick: onFirst },
        { text: "Second" }
      ]
    });

    const buttons = card.querySelectorAll(".card-actions button");
    expect(buttons).toHaveLength(2);

    (buttons[0] as HTMLButtonElement).click();
    expect(onFirst).toHaveBeenCalledTimes(1);
  });
});
