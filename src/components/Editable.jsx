import { useRef } from "react";

// Inline-editable rich text. Click directly into the output to edit it.
// Uses contentEditable so Steps 2-4 outputs are editable before moving forward.
export default function Editable({ as = "div", value, onChange, className = "", ...rest }) {
  const Tag = as;
  const ref = useRef(null);

  function commit() {
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
      onBlur={commit}
      className={`-mx-1 cursor-text rounded-[3px] px-1 outline-none transition-colors hover:bg-black/[0.02] focus:bg-black/[0.025] focus:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] ${className}`}
      title="Click to edit"
      {...rest}
    >
      {value}
    </Tag>
  );
}
