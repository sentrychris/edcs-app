"use client";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export default function NumberField({ label, value, onChange, min, max, disabled }: Props) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-neutral-400">
        {label}
      </label>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-[37px] w-full border border-sky-900/20 rounded-full bg-transparent pl-4 text-xs uppercase tracking-wider text-neutral-200 outline-none transition-colors focus:border-sky-500/60 focus:outline-none disabled:opacity-40"
      />
    </div>
  );
}
