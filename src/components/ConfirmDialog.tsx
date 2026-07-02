"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * Small, responsive confirmation dialog. Rendered in a portal on document.body
 * (bottom sheet on mobile, centered on desktop) so it's never clipped by or
 * misaligned within an ancestor. Use for destructive/irreversible actions.
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy, onCancel]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 text-left sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={() => !busy && onCancel()}
    >
      <div
        className="w-full max-w-sm rounded-t-2xl bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-xl sm:rounded-2xl sm:pb-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-ca-ink">{title}</h2>
        {message && <p className="mt-2 text-sm text-ca-gray">{message}</p>}
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="flex-1 rounded-lg border border-ca-line bg-white py-2.5 text-sm font-semibold text-ca-gray disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`flex-1 rounded-lg py-2.5 text-sm font-bold text-white disabled:opacity-50 ${
              destructive
                ? "bg-ca-red hover:opacity-90"
                : "bg-ca-blue hover:bg-ca-blue-dark"
            }`}
          >
            {busy ? "…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
