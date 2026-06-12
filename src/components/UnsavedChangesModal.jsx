// Lightweight confirmation gate when leaving a history report with unsaved edits.
export default function UnsavedChangesModal({ open, onSave, onDiscard, onCancel }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/[0.18] px-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="unsaved-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.06]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="unsaved-title" className="text-[16px] font-semibold text-ink">
          Unsaved changes
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
          You have unsaved report edits or follow-up messages. Save them before leaving?
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
            className="inline-flex h-9 items-center justify-center rounded-full bg-ink px-4 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
