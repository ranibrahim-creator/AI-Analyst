import { useEffect, useRef } from "react";
import AgentThinkingFeed from "./AgentThinkingFeed.jsx";

// Persistent composer. Hero = compact Notion-style prompt. Chat = follow-up bar.
export default function Composer({
  mode = "hero",
  value,
  onChange,
  onSubmit,
  placeholder,
  disabled = false,
  statusMessage = "",
  thinkingLines = [],
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
      <div className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-shadow focus-within:border-black/[0.12] focus-within:shadow-[0_4px_16px_rgba(0,0,0,0.07)]">
        <textarea
          ref={ref}
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={placeholder}
          className="max-h-24 w-full resize-none bg-transparent px-4 pb-1 pt-3.5 text-[15px] leading-snug text-ink outline-none placeholder:text-ink-faint"
        />
        <div className="flex items-center justify-end gap-2 px-3 pb-2.5 pt-0.5">
          <button
            type="button"
            onClick={submit}
            data-start
            aria-label={buttonLabel}
            className="grid h-8 w-8 place-items-center rounded-full bg-ink text-white transition-opacity hover:opacity-90"
          >
            <span aria-hidden className="text-[15px] leading-none">
              ↑
            </span>
          </button>
        </div>
      </div>
    );
  }

  if (mode === "thinking") {
    return <AgentThinkingFeed lines={thinkingLines} active />;
  }

  if (mode === "approval") {
    return (
      <p className="px-2 py-2 text-left text-[13px] font-medium leading-relaxed text-ink-soft">
        {statusMessage}
      </p>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]">
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
          disabled={disabled}
          className="inline-flex h-9 shrink-0 items-center rounded-full bg-ink px-4 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {buttonLabel}
        </button>
      </form>
    </div>
  );
}
