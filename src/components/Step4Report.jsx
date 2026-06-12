import { useEffect, useRef, useState } from "react";
import { answerQuestion } from "../data/analyst.js";
import Editable from "./Editable.jsx";

// Step 4 — final report. Fully editable inline, with a chat input pinned at
// the end to keep asking questions about the report.
export default function Step4Report({ report, readOnlyMeta, onEdit }) {
  const [thread, setThread] = useState([
    { role: "agent", text: "Ask for a deeper cut by market, theme, queue, or operational owner." },
  ]);
  const [pending, setPending] = useState(false);
  const [question, setQuestion] = useState("");
  const threadRef = useRef(null);

  useEffect(() => {
    setThread([
      { role: "agent", text: "Ask for a deeper cut by market, theme, queue, or operational owner." },
    ]);
    setQuestion("");
    setPending(false);
  }, [report.id]);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight });
  }, [thread, pending]);

  function ask(e) {
    e.preventDefault();
    const q = question.trim();
    if (!q || pending) return;
    setThread((t) => [...t, { role: "user", text: q }]);
    setQuestion("");
    setPending(true);
    setTimeout(() => {
      setThread((t) => [...t, { role: "agent", text: answerQuestion(q, report.title) }]);
      setPending(false);
    }, 600);
  }

  function editSection(si, pi, value) {
    if (!onEdit) return;
    const sections = report.sections.map((s, i) =>
      i === si ? { ...s, paragraphs: s.paragraphs.map((p, j) => (j === pi ? value : p)) } : s
    );
    onEdit({ ...report, sections });
  }

  function editRec(ri, value) {
    if (!onEdit) return;
    const recommendations = report.recommendations.map((r, i) => (i === ri ? value : r));
    onEdit({ ...report, recommendations });
  }

  function editTitle(value) {
    onEdit?.({ ...report, title: value });
  }

  return (
    <article className="mx-auto max-w-reading">
      <header className="mb-8">
        <span className="text-[12px] font-medium text-ink-muted">{report.tag}</span>
        <Editable
          as="h2"
          value={report.title}
          onChange={editTitle}
          className="mt-1 text-[28px] font-semibold leading-tight tracking-tight text-ink"
        />
        <p className="mt-2 text-[13px] text-ink-muted">
          {report.date} · {report.focus}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-ink-faint">
          {report.meta.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </header>

      <div className="space-y-9">
        {report.sections.map((section, si) => (
          <section key={si}>
            <h3 className="mb-3 text-[16px] font-semibold text-ink">{section.heading}</h3>
            <div className="space-y-3">
              {section.paragraphs.map((p, pi) => (
                <Editable
                  key={pi}
                  as="p"
                  value={p}
                  onChange={(v) => editSection(si, pi, v)}
                  className="text-[15px] leading-[1.75] text-ink-soft"
                />
              ))}
            </div>
          </section>
        ))}

        <section>
          <h3 className="mb-3 text-[16px] font-semibold text-ink">Recommended actions</h3>
          <ol className="space-y-2.5">
            {report.recommendations.map((r, ri) => (
              <li key={ri} className="flex gap-3 text-[15px] leading-relaxed text-ink-soft">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-noon" />
                <Editable as="span" value={r} onChange={(v) => editRec(ri, v)} />
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Ask box pinned at the end of the report */}
      <section className="mt-12 border-t border-line pt-7">
        <h3 className="mb-4 text-[15px] font-semibold text-ink">Ask about this report</h3>
        <div ref={threadRef} className="mb-3 max-h-72 space-y-3 overflow-y-auto">
          {thread.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user"
                  ? "ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-ink px-4 py-2 text-[14px] text-white"
                  : "w-fit max-w-[90%] text-[14px] leading-relaxed text-ink-soft"
              }
            >
              {m.text}
            </div>
          ))}
          {pending && (
            <div className="inline-flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-ink-faint animate-blink"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={ask}
          className="flex items-center gap-2 rounded-2xl bg-white p-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.04] focus-within:ring-black/10"
        >
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a follow-up about this report…"
            data-ask-input
            className="h-9 w-full bg-transparent px-3 text-[14px] text-ink outline-none placeholder:text-ink-faint"
          />
          <button
            type="submit"
            className="inline-flex h-9 shrink-0 items-center rounded-full bg-ink px-4 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Ask
          </button>
        </form>
      </section>
    </article>
  );
}
