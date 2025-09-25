import React, { useEffect, useRef, useState } from "react";

type Props = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
};

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current && value !== ref.current.innerHTML) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  useEffect(() => {
    return () => {
      // nothing to cleanup
    };
  }, []);

  const exec = (command: string, valueArg: string | null = null) => {
    try {
      document.execCommand(command, false, valueArg as any);
      // propagate change
      if (ref.current) onChange(ref.current.innerHTML);
    } catch (e) {
      console.warn("execCommand failed", e);
    }
  };

  const insertLink = () => {
    const url = window.prompt("Enter URL");
    if (url) exec("createLink", url);
  };

  const setHeading = (tag: "h1" | "h2" | "p") => {
    try {
      document.execCommand("formatBlock", false, tag === "p" ? "p" : tag);
      if (ref.current) onChange(ref.current.innerHTML);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => exec("bold")}
          className="rounded border px-2 py-1 text-sm"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => exec("italic")}
          className="rounded border px-2 py-1 text-sm"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => exec("underline")}
          className="rounded border px-2 py-1 text-sm"
        >
          U
        </button>
        <button
          type="button"
          onClick={() => setHeading("h1")}
          className="rounded border px-2 py-1 text-sm"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => setHeading("h2")}
          className="rounded border px-2 py-1 text-sm"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => setHeading("p")}
          className="rounded border px-2 py-1 text-sm"
        >
          P
        </button>
        <button
          type="button"
          onClick={() => exec("insertUnorderedList")}
          className="rounded border px-2 py-1 text-sm"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => exec("insertOrderedList")}
          className="rounded border px-2 py-1 text-sm"
        >
          1. List
        </button>
        <button
          type="button"
          onClick={insertLink}
          className="rounded border px-2 py-1 text-sm"
        >
          Link
        </button>
        <button
          type="button"
          onClick={() => exec("unlink")}
          className="rounded border px-2 py-1 text-sm"
        >
          Unlink
        </button>
        <button
          type="button"
          onClick={() => {
            if (ref.current) {
              ref.current.innerHTML = "";
              onChange("");
            }
          }}
          className="rounded border px-2 py-1 text-sm text-red-600"
        >
          Clear
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        className="min-h-[120px] rounded-md bg-transparent border border-primary/30 px-3 py-2 text-primary"
        data-placeholder={placeholder}
        style={{ outline: "none" }}
      />
    </div>
  );
}
