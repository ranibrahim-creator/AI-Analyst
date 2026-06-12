// Lightweight confirmation gate when leaving a history report with unsaved edits.
export default function UnsavedChangesModal({ open, onSave, onDiscard, onCancel }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-[2px]"
      style={{ backgroundColor: "var(--modal-overlay)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="unsaved-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-elevated p-6 ring-1 ring-[var(--border-faint)]"
        style={{ boxShadow: "var(--modal-shadow)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="unsaved-title" className="text-[16px] font-semibold text-ink">
          Unsaved changes
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
          You have unsaved follow-up messages. Save them before leaving?
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onDiscard}
            className="inline-flex h-9 items-center justify-center rounded-full px-4 text-[13px] font-medium text-ink-muted transition-colors hover:text-ink"
          >
            Discard changes
          </button>
          <button
            type="button"
            onClick={onSave}
            className="inline-flex h-9 items-center justify-center rounded-full bg-[var(--button-primary)] px-4 text-[13px] font-medium text-[var(--button-primary-text)] transition-opacity hover:opacity-90"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
