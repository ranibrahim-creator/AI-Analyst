import { AGENTS } from "../data/analyst.js";
import Editable from "./Editable.jsx";

// Step 2 — one agent at a time on a clean, dedicated screen. Thoughts and the
// proposal are click-to-edit. A single inline Approve / Cancel advances the flow.
export default function Step2Thinking({ index, revealed, ready, edits, onEdit, onApprove, onCancel }) {
  const agent = AGENTS[index];
  const isLast = index >= AGENTS.length - 1;

  return (
    <div className="mx-auto max-w-reading">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[12px] font-medium text-ink-muted">
          <span>Agent {index + 1} of {AGENTS.length}</span>
          <span className="h-1 w-1 rounded-full bg-ink-faint" />
          <span>{agent.role}</span>
        </div>
        <h2 className="mt-1 text-[24px] font-semibold tracking-tight text-ink">{agent.name}</h2>
      </div>

      <div className="space-y-2.5">
        {agent.thoughts.map((t, ti) => {
          if (ti >= revealed) return null;
          const key = `${agent.id}-t-${ti}`;
          return (
            <Editable
              key={key}
              as="p"
              value={edits[key] ?? t}
              onChange={(v) => onEdit(key, v)}
              className="animate-fade-up text-[15px] leading-relaxed text-ink-soft"
            />
          );
        })}
      </div>

      {ready && (
        <div className="mt-8 animate-fade-up">
          <p className="mb-3 text-[12px] font-medium uppercase tracking-wide text-ink-muted">Proposed</p>
          <ul className="space-y-2">
            {agent.proposal.map((p, pi) => {
              const key = `${agent.id}-p-${pi}`;
              return (
                <li key={key} className="flex gap-2.5 text-[15px] text-ink">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-noon" />
                  <Editable as="span" value={edits[key] ?? p} onChange={(v) => onEdit(key, v)} className="leading-relaxed" />
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex items-center gap-4">
            <button
              type="button"
              onClick={onApprove}
              data-approve
              className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
            >
              {isLast ? "Approve & view analytics" : "Approve & continue"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="text-[13px] font-medium text-ink-muted transition-colors hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
