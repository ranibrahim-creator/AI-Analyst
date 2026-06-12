// Minimal, borderless charts. Noon yellow used only as a thin accent.

export function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.label} className="grid grid-cols-[7rem_1fr_2.5rem] items-center gap-3 text-[13px]">
          <span className="text-ink-soft">{d.label}</span>
          <span className="h-[6px] rounded-full bg-[var(--hover-subtle)]">
            <span
              className="block h-full rounded-full bg-ink/80"
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </span>
          <span className="text-right tabular-nums font-medium text-ink">{d.value}%</span>
        </div>
      ))}
    </div>
  );
}

export function Donut({ data }) {
  let acc = 0;
  const stops = data.map((d, i) => {
    const start = acc;
    acc += d.value;
    const shades = ["#23211d", "#8c887f", "#FEEE00"];
    return `${shades[i % shades.length]} ${start}% ${acc}%`;
  });
  return (
    <div className="flex items-center gap-7">
      <div
        className="relative h-36 w-36 shrink-0 rounded-full"
        style={{ background: `conic-gradient(${stops.join(",")})` }}
        aria-hidden
      >
        <div className="absolute inset-7 grid place-items-center rounded-full bg-canvas">
          <span className="text-2xl font-semibold tracking-tight">71</span>
        </div>
      </div>
      <ul className="space-y-2.5 text-[13px] text-ink-soft">
        {data.map((d, i) => {
          const dots = ["bg-ink", "bg-ink-muted", "bg-noon"];
          return (
            <li key={d.label} className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${dots[i % dots.length]}`} />
              {d.label} {d.value}%
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function LineChart({ data }) {
  const w = 600;
  const h = 150;
  const pad = 24;
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;
  const pts = data.map((d, i) => {
    const x = pad + (i * (w - pad * 2)) / (data.length - 1);
    const y = pad + (1 - (d.value - min) / range) * (h - pad * 2);
    return { x, y, ...d };
  });
  const line = pts.map((p) => `${p.x},${p.y}`).join(" ");
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-40 w-full overflow-visible">
        <polyline
          points={line}
          fill="none"
          stroke="#23211d"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {pts.map((p) => (
          <circle key={p.label} cx={p.x} cy={p.y} r="4" fill="#F9F9F9" stroke="#23211d" strokeWidth="2.5" />
        ))}
      </svg>
      <div className="mt-2 flex justify-between text-[12px] text-ink-muted">
        {data.map((d) => (
          <span key={d.label}>
            {d.label} <span className="text-ink">{d.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
