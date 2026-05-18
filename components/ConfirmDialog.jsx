import React from "react";

const ConfirmDialog = ({
  isOpen,
  eyebrow = "Please confirm",
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmTone = "danger",
  onConfirm,
  onCancel,
  busy = false
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="logout-dialog" role="presentation">
      <div
        className="logout-dialog__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        <p className="logout-dialog__eyebrow">{eyebrow}</p>
        <h2 id="confirm-dialog-title">{title}</h2>
        <p className="logout-dialog__text">{message}</p>

        <div className="logout-dialog__actions">
          <button
            type="button"
            className="logout-dialog__cancel"
            onClick={onCancel}
            disabled={busy}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            className={`logout-dialog__confirm logout-dialog__confirm--${confirmTone}`}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Working..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
