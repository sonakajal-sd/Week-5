import { Button } from "@components/button.js";

describe("Button", () => {
  it("uses its default props when called with nothing", () => {
    const button = Button();

    expect(button.textContent).toBe("");
    expect(button.type).toBe("button");
    expect(button.className).toBe("btn btn-primary");
    expect(button.disabled).toBe(false);
  });

  it("does not attach a click listener when onClick is not given", () => {
    const button = Button({ text: "No handler" });

    // Nothing to assert on directly, but clicking must not throw.
    expect(() => button.click()).not.toThrow();
  });

  it("applies the given text, variant, type and disabled state", () => {
    const button = Button({
      text: "Save",
      variant: "danger",
      type: "reset",
      disabled: true
    });

    expect(button.textContent).toBe("Save");
    expect(button.className).toBe("btn btn-danger");
    expect(button.type).toBe("reset");
    expect(button.disabled).toBe(true);
  });

  it("calls onClick when clicked", () => {
    const onClick = jest.fn();
    const button = Button({ text: "Go", onClick });

    button.click();

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
