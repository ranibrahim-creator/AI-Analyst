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
      className={`-mx-1 cursor-text px-1 ${className}`}
      title="Click to edit"
      {...rest}
    >
      {value}
    </Tag>
  );
}
