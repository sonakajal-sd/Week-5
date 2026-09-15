interface ButtonProps {
  text?: string;
  onClick?: (event: MouseEvent) => void;
  variant?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function Button({
  text = "",
  onClick,
  variant = "primary",
  type = "button",
  disabled = false
}: ButtonProps = {}): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = type;
  button.textContent = text;
  button.className = `btn btn-${variant}`;
  button.disabled = disabled;

  if (onClick) {
    button.addEventListener("click", onClick);
  }

  return button;
}
