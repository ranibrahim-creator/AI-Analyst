import { useState } from "react";
import { ANALYTICS } from "../data/analyst.js";
import { BarChart, Donut, LineChart } from "./Charts.jsx";
import Editable from "./Editable.jsx";

// Step 3 — analytics checkpoint on its own dedicated screen. Note is editable.
export default function Step3Analytics({ onContinue, onBack }) {
  const [note, setNote] = useState(
    "Payments dominate contact volume and drive the most repeat tickets — prioritize a status explanation."
  );

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <div className="text-[12px] font-medium text-ink-muted">Step 3</div>
        <h2 className="mt-1 text-[24px] font-semibold tracking-tight text-ink">Analytics checkpoint</h2>
        <p className="mt-1 text-[14px] text-ink-muted">Review the signal before the report is written.</p>
      </div>

      <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-4">
        {ANALYTICS.metrics.map((m) => (
          <div key={m.label}>
            <div className="text-[13px] text-ink-muted">{m.label}</div>
            <div className="mt-1 text-[28px] font-semibold tracking-tight text-ink">{m.value}</div>
            <div className="mt-0.5 text-[12px] text-ink-faint">{m.trend}</div>
          </div>
        ))}
      </div>

      <div className="mt-12 space-y-12">
        <section>
          <div className="mb-5 flex items-baseline justify-between">
            <h3 className="text-[15px] font-semibold text-ink">Top contact drivers</h3>
            <span className="text-[12px] text-ink-muted">Last 4 weeks</span>
          </div>
          <BarChart data={ANALYTICS.drivers} />
        </section>

        <section>
          <div className="mb-5 flex items-baseline justify-between">
            <h3 className="text-[15px] font-semibold text-ink">Conversation health</h3>
            <span className="text-[12px] text-ink-muted">AI classified</span>
          </div>
          <Donut data={ANALYTICS.health} />
        </section>

        <section>
          <div className="mb-5 flex items-baseline justify-between">
            <h3 className="text-[15px] font-semibold text-ink">Agent confidence by stage</h3>
            <span className="text-[12px] text-ink-muted">Checkpoint validated</span>
          </div>
          <LineChart data={ANALYTICS.confidence} />
        </section>

        <section>
          <h3 className="mb-2 text-[15px] font-semibold text-ink">Analyst note</h3>
          <Editable as="p" value={note} onChange={setNote} className="text-[14px] leading-relaxed text-ink-soft" />
        </section>
      </div>

      <div className="mt-12 flex items-center gap-4">
        <button
          type="button"
          onClick={onContinue}
          data-continue
          className="inline-flex h-9 items-center rounded-full bg-accent px-4 text-[13px] font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          Generate report
        </button>
        <button
          type="button"
          onClick={onBack}
          className="text-[13px] font-medium text-ink-muted transition-colors hover:text-ink"
        >
          Back to thinking
        </button>
      </div>
    </div>
  );
}
