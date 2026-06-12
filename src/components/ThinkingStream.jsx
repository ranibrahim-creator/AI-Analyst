import AmbientBlob from "./AmbientBlob.jsx";

// Short 1–2 line "agent thinking" stream shown right above the docked composer.
export default function ThinkingStream({ title, detail }) {
  return (
    <div className="mb-3 flex items-center gap-3 px-1">
      <div className="relative grid h-9 w-9 shrink-0 place-items-center">
        <AmbientBlob mode="think" className="absolute inset-0" />
        <span className="relative h-2 w-2 rounded-full bg-ink/70" />
      </div>
      <div className="min-w-0 leading-tight">
        <div className="flex items-center gap-2 text-[13px] font-medium text-ink">
          <span className="truncate">{title}</span>
          <span className="inline-flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1 w-1 rounded-full bg-ink-faint animate-blink"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </span>
        </div>
        {detail && <div className="truncate text-[12px] text-ink-muted">{detail}</div>}
      </div>
    </div>
  );
}
