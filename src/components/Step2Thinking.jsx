import { useEffect, useRef, useState } from "react";
import { AGENTS } from "../data/analyst.js";
import Editable from "./Editable.jsx";

function Thinking() {
  return (
    <span className="inline-flex items-center gap-1 align-middle">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-ink-faint animate-blink"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </span>
  );
}

// Step 2 — agents narrate their thinking, then a single inline Approve / Cancel.
// Outputs (thoughts + proposals) are click-to-edit.
export default function Step2Thinking({ objective, onComplete, onCancel }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(0); // thoughts shown for current agent
  const [ready, setReady] = useState(false);
  const [edits, setEdits] = useState({});
  const timers = useRef([]);

  const agent = AGENTS[index];

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRevealed(0);
    setReady(false);

    agent.thoughts.forEach((_, i) => {
      timers.current.push(
        setTimeout(() => setRevealed(i + 1), 450 * (i + 1))
      );
    });
    timers.current.push(
      setTimeout(() => setReady(true), 450 * (agent.thoughts.length + 1))
    );

    return () => timers.current.forEach(clearTimeout);
  }, [index, agent.thoughts]);

  function getThought(agentId, i, fallback) {
    return edits[`${agentId}-t-${i}`] ?? fallback;
  }
  function getProposal(agentId, i, fallback) {
    return edits[`${agentId}-p-${i}`] ?? fallback;
  }
  function setEdit(key, val) {
    setEdits((prev) => ({ ...prev, [key]: val }));
  }

  function approve() {
    if (index >= AGENTS.length - 1) {
      onComplete();
    } else {
      setIndex((n) => n + 1);
    }
  }

  return (
    <div className="mx-auto max-w-reading">
      <p className="mb-1 text-[13px] font-medium text-ink-muted">Working on</p>
      <Editable
        as="p"
        value={objective.objective || objective}
        onChange={() => {}}
        className="mb-9 text-[15px] leading-relaxed text-ink-soft"
      />

      <div className="space-y-10">
        {AGENTS.slice(0, index + 1).map((a, ai) => {
          const isCurrent = ai === index;
          const done = ai < index;
          return (
            <section key={a.id} className="animate-fade-up">
              <header className="mb-3 flex items-center gap-2.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isCurrent && !ready ? "bg-ink-faint animate-blink" : "bg-noon"
                  }`}
                />
                <h3 className="text-[15px] font-semibold text-ink">{a.name}</h3>
                <span className="text-[12px] text-ink-muted">{a.role}</span>
              </header>

              <div className="space-y-2 pl-4">
                {a.thoughts.map((t, ti) => {
                  const show = done || ti < revealed;
                  if (!show) return null;
                  return (
                    <Editable
                      key={ti}
                      as="p"
                      value={getThought(a.id, ti, t)}
                      onChange={(v) => setEdit(`${a.id}-t-${ti}`, v)}
                      className="text-[14px] leading-relaxed text-ink-soft animate-fade-up"
                    />
                  );
                })}
                {isCurrent && !ready && (
                  <p className="pl-1 pt-1">
                    <Thinking />
                  </p>
                )}
              </div>

              {(done || (isCurrent && ready)) && (
                <div className="mt-4 pl-4">
                  <p className="mb-2 text-[12px] font-medium uppercase tracking-wide text-ink-muted">
                    Proposed
                  </p>
                  <ul className="space-y-1.5">
                    {a.proposal.map((p, pi) => (
                      <li key={pi} className="flex gap-2 text-[14px] text-ink">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
                        <Editable
                          as="span"
                          value={getProposal(a.id, pi, p)}
                          onChange={(v) => setEdit(`${a.id}-p-${pi}`, v)}
                          className="leading-relaxed"
                        />
                      </li>
                    ))}
                  </ul>

                  {isCurrent && ready && (
                    <div className="mt-5 flex items-center gap-4">
                      <button
                        type="button"
                        onClick={approve}
                        data-approve
                        className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
                      >
                        {index >= AGENTS.length - 1 ? "Approve & view analytics" : "Approve & continue"}
                      </button>
                      <button
                        type="button"
                        onClick={onCancel}
                        className="text-[13px] font-medium text-ink-muted transition-colors hover:text-ink"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
