import React, { useEffect, useRef } from 'react';

export default function RichTextEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || '';
    }
  }, [value]);

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val || undefined);
    onChange(ref.current?.innerHTML || '');
  };

  return (
    <div>
      <div className="mb-2 flex gap-2">
        <button type="button" onClick={() => exec('bold')} className="px-2 py-1 rounded border">B</button>
        <button type="button" onClick={() => exec('italic')} className="px-2 py-1 rounded border">I</button>
        <button type="button" onClick={() => exec('insertUnorderedList')} className="px-2 py-1 rounded border">• List</button>
        <button type="button" onClick={() => exec('createLink', prompt('Enter URL') || '')} className="px-2 py-1 rounded border">Link</button>
      </div>
      <div
        ref={ref}
        contentEditable
        onInput={(e) => onChange((e.target as HTMLElement).innerHTML)}
        className="min-h-[140px] rounded-md border border-primary/30 bg-transparent px-3 py-2 text-primary"
      />
    </div>
  );
}
