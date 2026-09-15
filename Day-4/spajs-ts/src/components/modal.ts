import { Button } from "./button.js";

interface ModalProps {
  title?: string;
  content?: string | Node;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onClose?: () => void;
}

export function Modal({
  title = "",
  content = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose
}: ModalProps = {}): HTMLDivElement {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");

  const heading = document.createElement("h2");
  heading.textContent = title;

  const body = document.createElement("div");
  body.className = "modal-body";
  if (content instanceof Node) {
    body.append(content);
  } else {
    body.textContent = content;
  }

  const actions = document.createElement("div");
  actions.className = "modal-actions";

  const cancelButton = Button({
    text: cancelText,
    variant: "secondary",
    onClick: () => close()
  });

  const confirmButton = Button({
    text: confirmText,
    variant: "danger",
    onClick: () => confirm()
  });

  actions.append(cancelButton, confirmButton);
  modal.append(heading, body, actions);
  overlay.append(modal);

  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "Enter") {
      event.preventDefault();
      confirm();
    }
  }

  function cleanup() {
    document.removeEventListener("keydown", handleKeydown);
    overlay.remove();
  }

  function close() {
    cleanup();
    if (onClose) onClose();
  }

  function confirm() {
    cleanup();
    if (onConfirm) onConfirm();
  }

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });

  document.addEventListener("keydown", handleKeydown);

  return overlay;
}
