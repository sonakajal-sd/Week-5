import { Modal } from "@components/modal.js";

describe("Modal keyboard navigation", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("closes on Escape", () => {
    const onClose = jest.fn();
    const modal = Modal({ title: "Confirm?", content: "Are you sure?", onClose });
    document.body.append(modal);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(document.body.contains(modal)).toBe(false);
  });

  it("confirms on Enter", () => {
    const onConfirm = jest.fn();
    const modal = Modal({ title: "Confirm?", content: "Are you sure?", onConfirm });
    document.body.append(modal);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(document.body.contains(modal)).toBe(false);
  });

  it("removes its keydown listener once closed", () => {
    const onConfirm = jest.fn();
    const modal = Modal({ title: "Confirm?", content: "Are you sure?", onConfirm });
    document.body.append(modal);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("ignores keys other than Escape and Enter", () => {
    const onClose = jest.fn();
    const onConfirm = jest.fn();
    const modal = Modal({ title: "Confirm?", content: "Are you sure?", onClose, onConfirm });
    document.body.append(modal);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));

    expect(onClose).not.toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
    expect(document.body.contains(modal)).toBe(true);
  });

  it("closes fine on Escape even when no onClose callback was given", () => {
    const modal = Modal({ title: "Confirm?", content: "Are you sure?" });
    document.body.append(modal);

    expect(() =>
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
    ).not.toThrow();

    expect(document.body.contains(modal)).toBe(false);
  });

  it("confirms fine on Enter even when no onConfirm callback was given", () => {
    const modal = Modal({ title: "Confirm?", content: "Are you sure?" });
    document.body.append(modal);

    expect(() =>
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }))
    ).not.toThrow();

    expect(document.body.contains(modal)).toBe(false);
  });
});

describe("Modal mouse interaction", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("closes when the Cancel button is clicked", () => {
    const onClose = jest.fn();
    const modal = Modal({ title: "Confirm?", content: "Are you sure?", onClose });
    document.body.append(modal);

    modal.querySelector<HTMLButtonElement>(".btn-secondary")!.click();

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(document.body.contains(modal)).toBe(false);
  });

  it("confirms when the confirm button is clicked", () => {
    const onConfirm = jest.fn();
    const modal = Modal({ title: "Confirm?", content: "Are you sure?", onConfirm });
    document.body.append(modal);

    modal.querySelector<HTMLButtonElement>(".btn-danger")!.click();

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("closes when clicking the overlay outside the modal box", () => {
    const onClose = jest.fn();
    const modal = Modal({ title: "Confirm?", content: "Are you sure?", onClose });
    document.body.append(modal);

    // `modal` itself is the overlay element (see Modal's return value).
    modal.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close when clicking inside the modal box", () => {
    const onClose = jest.fn();
    const modal = Modal({ title: "Confirm?", content: "Are you sure?", onClose });
    document.body.append(modal);

    modal.querySelector(".modal")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("uses sensible defaults when called with no props at all", () => {
    const modal = Modal();

    expect(modal.querySelector("h2")!.textContent).toBe("");
    expect(modal.querySelector(".modal-body")!.textContent).toBe("");
    const buttonTexts = Array.from(modal.querySelectorAll("button")).map((b) => b.textContent);
    expect(buttonTexts).toEqual(["Cancel", "Confirm"]);
  });

  it("accepts a DOM node as content instead of a plain string", () => {
    const paragraph = document.createElement("p");
    paragraph.textContent = "Rich content";

    const modal = Modal({ title: "Confirm?", content: paragraph });

    expect(modal.querySelector(".modal-body")!.contains(paragraph)).toBe(true);
  });
});
