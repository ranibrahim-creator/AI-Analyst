// Fluid, gaseous AI aura. Two layered radial-gradient blobs with heavy blur.
// `mode` switches between the slow idle drift and the faster thinking pulse.
export default function AmbientBlob({ mode = "idle", className = "" }) {
  const state = mode === "think" ? "ai-aura--think" : "ai-aura--idle";
  return (
    <div className={`pointer-events-none relative ${className}`} aria-hidden="true">
      <div className={`ai-aura ${state}`} />
      <div className={`ai-aura ai-aura--secondary ${state}`} />
    </div>
  );
}
