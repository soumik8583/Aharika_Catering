"use client";

import Modal from "@/components/ui/Modal";

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title} maxWidth="max-w-sm">
      <p className="text-sm text-charcoal/75">{message}</p>
      <div className="mt-6 flex gap-3">
        <button onClick={onCancel} className="btn-outline flex-1 py-2">Cancel</button>
        <button
          onClick={onConfirm}
          className="btn flex-1 bg-red-600 py-2 text-white hover:bg-red-700"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
