import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
};

export default function Modal({ open, onClose, title, children }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-md bg-white/5 p-4">
        {title && <div className="mb-2 text-lg font-semibold">{title}</div>}
        <div>{children}</div>
        <button onClick={onClose} className="absolute top-2 right-2 text-sm">
          Close
        </button>
      </div>
    </div>
  );
}
