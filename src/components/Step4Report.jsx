import Editable from "./Editable.jsx";

function fieldKey(sectionIndex, paragraphIndex) {
  return `s-${sectionIndex}-p-${paragraphIndex}`;
}

function recKey(index) {
  return `r-${index}`;
}

// Step 4 — final report. Static in the live flow; editable when reviewing history.
export default function Step4Report({ report, qa = [], pending = false, editable = false, edits = {}, onEdit }) {
  function val(key, fallback) {
    return edits[key] ?? fallback;
  }

  return (
    <article className="mx-auto max-w-reading">
      <header className="mb-8">
        <span className="text-[12px] font-medium text-ink-muted">{report.tag}</span>
        {editable ? (
          <Editable
            key={`title-${report.id}`}
            as="h2"
            value={val("title", report.title)}
            onChange={(v) => onEdit?.("title", v)}
            className="mt-1 text-[28px] font-semibold leading-tight tracking-tight text-ink"
          />
        ) : (
          <h2 className="mt-1 text-[28px] font-semibold leading-tight tracking-tight text-ink">{report.title}</h2>
        )}
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
              {section.paragraphs.map((p, pi) => {
                const key = fieldKey(si, pi);
                return editable ? (
                  <Editable
                    key={`${report.id}-${key}`}
                    as="p"
                    value={val(key, p)}
                    onChange={(v) => onEdit?.(key, v)}
                    className="text-[15px] leading-[1.75] text-ink-soft"
                  />
                ) : (
                  <p key={key} className="text-[15px] leading-[1.75] text-ink-soft">
                    {p}
                  </p>
                );
              })}
            </div>
          </section>
        ))}

        <section>
          <h3 className="mb-3 text-[16px] font-semibold text-ink">Recommended actions</h3>
          <ol className="space-y-2.5">
            {report.recommendations.map((r, ri) => {
              const key = recKey(ri);
              return (
                <li key={key} className="flex gap-3 text-[15px] leading-relaxed text-ink-soft">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-noon" />
                  {editable ? (
                    <Editable
                      key={`${report.id}-${key}`}
                      as="span"
                      value={val(key, r)}
                      onChange={(v) => onEdit?.(key, v)}
                      className="leading-relaxed"
                    />
                  ) : (
                    <span>{r}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      {(qa.length > 0 || pending) && (
        <section className="mt-12 border-t border-line pt-7">
          <h3 className="mb-4 text-[13px] font-medium text-ink-muted">Follow-up</h3>
          <div className="space-y-4">
            {qa.map((m, i) =>
              m.role === "user" ? (
                <div
                  key={i}
                  className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-ink px-4 py-2 text-[14px] text-white"
                >
                  {m.text}
                </div>
              ) : (
                <p key={i} className="max-w-[90%] text-[15px] leading-relaxed text-ink-soft">
                  {m.text}
                </p>
              )
            )}
            {pending && (
              <span className="inline-flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-ink-faint animate-blink"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </span>
            )}
          </div>
        </section>
      )}
    </article>
  );
}

export { fieldKey, recKey };
