import { useEffect, useRef } from "react";
import AmbientBlob from "./AmbientBlob.jsx";

// Persistent composer. In `hero` mode it is the large Step 1 prompt box; in
// `chat` mode it is the slim follow-up bar pinned at the bottom of the report.
export default function Composer({
  mode = "hero",
  value,
  onChange,
  onSubmit,
  placeholder,
  disabled = false,
  statusMessage = "",
  buttonLabel = "Start",
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (mode === "hero") ref.current?.focus();
  }, [mode]);

  function submit() {
    const text = (value || "").trim();
    if (text && !disabled) onSubmit(text);
  }

  if (mode === "hero") {
    return (
      <div className="rounded-3xl bg-white p-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] transition-shadow focus-within:shadow-[0_4px_20px_rgba(0,0,0,0.09)]">
        <textarea
          ref={ref}
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={placeholder}
          className="w-full resize-none bg-transparent px-3 py-2 text-[15px] leading-relaxed text-ink outline-none placeholder:text-ink-faint"
        />
        <div className="flex items-center justify-end px-1 pb-0.5">
          <button
            type="button"
            onClick={submit}
            data-start
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink px-4 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
          >
            {buttonLabel}
            <span aria-hidden>↑</span>
          </button>
        </div>
      </div>
    );
  }

  // Slim chat bar or morphed status state (while agents run / await approval)
  return (
    <div className="rounded-2xl bg-white p-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]">
      {disabled ? (
        <div className="flex min-h-[52px] items-center justify-center gap-3 px-4 text-center">
          <span className="relative grid h-7 w-7 place-items-center">
            <AmbientBlob mode="think" className="absolute inset-0" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-ink/70" />
          </span>
          <p className="status-pulse text-[13px] font-medium text-ink-soft">
            {statusMessage || "Report agent is waiting for your approval. Approve to continue to the next agent."}
          </p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="flex items-center gap-2"
        >
          <input
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            data-ask-input
            className="h-9 w-full bg-transparent px-3 text-[14px] text-ink outline-none placeholder:text-ink-faint disabled:cursor-default"
          />
          <button
            type="submit"
            className="inline-flex h-9 shrink-0 items-center rounded-full bg-ink px-4 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
          >
            {buttonLabel}
          </button>
        </form>
      )}
    </div>
  );
}
