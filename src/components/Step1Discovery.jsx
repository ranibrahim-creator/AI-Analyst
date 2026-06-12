import { useState } from "react";

const SUGGESTIONS = [
  "Summarize seller support conversations and surface the top operational friction points.",
  "Find the contact drivers causing repeat tickets and recommend macros to reduce them.",
  "Build a weekly digest of unresolved fulfillment and returns escalations by owner.",
  "Analyze new seller onboarding tickets and explain where the journey breaks down.",
];

// Step 1 — the only phase that looks like a traditional chat messenger window.
export default function Step1Discovery({ greeting, onSubmit }) {
  const [value, setValue] = useState(
    "Summarize seller support conversations, identify operational friction, and produce a leadership-ready report."
  );

  function submit() {
    const text = value.trim();
    if (text) {
      onSubmit(text);
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-reading flex-col justify-center">
      <h1 className="text-[28px] font-semibold tracking-tight text-ink">{greeting}</h1>
      <p className="mt-2 text-[15px] text-ink-muted">
        Describe what to analyze. The four agents will plan, query, cluster, and write it up.
      </p>

      {/* Chat messenger input */}
      <div className="mt-7 rounded-3xl bg-white p-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] transition-shadow focus-within:shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
        <textarea
          autoFocus
          rows={3}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Message the Tech Care analyst…"
          className="w-full resize-none bg-transparent px-3 py-2 text-[15px] leading-relaxed text-ink outline-none placeholder:text-ink-faint"
        />
        <div className="flex items-center justify-between px-2 pb-1 pt-1">
          <span className="text-[12px] text-ink-faint">4 agents · plan → SQL → themes → report</span>
          <button
            type="button"
            onClick={submit}
            data-start
            className="inline-flex h-9 items-center gap-2 rounded-full bg-ink px-4 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Start
            <span aria-hidden>↑</span>
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setValue(s)}
            className="rounded-full bg-white px-3 py-1.5 text-[13px] text-ink-soft ring-1 ring-black/[0.05] transition-colors hover:text-ink hover:ring-black/10"
          >
            {s.split(" ").slice(0, 3).join(" ")}…
          </button>
        ))}
      </div>
    </div>
  );
}
