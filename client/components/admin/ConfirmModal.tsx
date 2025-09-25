import React from "react";
import Modal from "./Modal";

type Props = {
  open: boolean;
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmModal({
  open,
  title,
  message,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <div className="mt-2">
        <div className="mb-4 text-sm text-primary/80">{message}</div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-md border border-primary/30 px-3 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-3 py-2 text-sm text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
