import { AGENTS } from "../data/analyst.js";
import Editable from "./Editable.jsx";

// Step 2 — agent proposal + approval on the main canvas. Thinking animation lives in the composer dock.
export default function Step2Thinking({ index, ready, edits, onEdit, onApprove, onCancel }) {
  const agent = AGENTS[index];
  const isLast = index >= AGENTS.length - 1;

  return (
    <div className="mx-auto max-w-reading">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[12px] font-medium text-ink-muted">
          <span>
            Agent {index + 1} of {AGENTS.length}
          </span>
          <span className="h-1 w-1 rounded-full bg-ink-faint" />
          <span>{agent.role}</span>
        </div>
        <h2 className="mt-1 text-[24px] font-semibold tracking-tight text-ink">{agent.name}</h2>
      </div>

      {ready ? (
        <div>
          <p className="mb-3 text-[12px] font-medium uppercase tracking-wide text-ink-muted">Proposed</p>
          <ul className="space-y-2">
            {agent.proposal.map((p, pi) => {
              const key = `${agent.id}-p-${pi}`;
              return (
                <li key={key} className="flex gap-2.5 text-[15px] text-ink">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-noon" />
                  <Editable
                    as="span"
                    value={edits[key] ?? p}
                    onChange={(v) => onEdit(key, v)}
                    className="leading-relaxed"
                  />
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex items-center gap-4">
            <button
              type="button"
              onClick={onApprove}
              data-approve
              className="inline-flex h-9 items-center rounded-full bg-[var(--button-primary)] px-4 text-[13px] font-medium text-[var(--button-primary-text)] transition-opacity hover:opacity-90"
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
      ) : (
        <p className="text-[14px] text-ink-muted">Reviewing evidence and drafting a checkpoint…</p>
      )}
    </div>
  );
}
