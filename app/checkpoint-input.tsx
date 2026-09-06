"use client";

import { useState, type InputHTMLAttributes } from "react";

export function checkpointInputError(text: string, min: number, max: number) {
  if (!text.trim()) return "Enter a value, or press Escape to keep the previous value.";
  const value = Number(text);
  return !Number.isSafeInteger(value) || value < min || value > max
    ? `Enter a whole number from ${min.toLocaleString("en-GB")} to ${max.toLocaleString("en-GB")}.`
    : "";
}

/** Keep typing local: recalculate and sync the route only after a field is committed. */
export function CheckpointInput({ value, min, max, onCommit, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "min" | "max" | "onChange"> & {
  value?: number; min: number; max: number; onCommit: (value: number) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState("");
  const commit = () => {
    if (draft === null) return;
    const message = checkpointInputError(draft, min, max);
    setError(message);
    if (message) return;
    const next = Number(draft);
    setDraft(null);
    if (next !== value) onCommit(next);
  };
  return <span className="checkpoint-field">
    <input {...props} type="number" inputMode="numeric" step="1" min={min} max={max}
      value={draft ?? value ?? ""} aria-invalid={error ? true : undefined}
      onChange={(event) => { setDraft(event.target.value); setError(""); }} onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === "Enter") { event.preventDefault(); event.currentTarget.blur(); }
        if (event.key === "Escape") { event.preventDefault(); setDraft(null); setError(""); }
      }} />
    {error && <span className="checkpoint-field-error" role="alert">{error}</span>}
  </span>;
}
