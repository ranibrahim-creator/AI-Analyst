import { useLayoutEffect, useRef } from "react";

// Inline-editable text. Syncs from props only when not focused so typing isn't reset.
export default function Editable({ as = "div", value, onChange, className = "", ...rest }) {
  const Tag = as;
  const ref = useRef(null);
  const focused = useRef(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || focused.current) return;
    const next = value ?? "";
    if (el.textContent !== next) {
      el.textContent = next;
    }
  }, [value]);

  function commit() {
    focused.current = false;
    const next = ref.current?.innerText ?? "";
    if (next !== value) {
      onChange?.(next);
    }
  }

  return (
    <Tag
      ref={ref}
      role="textbox"
      tabIndex={0}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onFocus={() => {
        focused.current = true;
      }}
      onBlur={commit}
      className={`-mx-1 cursor-text rounded-[3px] px-1 outline-none transition-colors hover:bg-black/[0.02] focus:bg-black/[0.025] focus:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] ${className}`}
      title="Click to edit"
      {...rest}
    />
  );
}
