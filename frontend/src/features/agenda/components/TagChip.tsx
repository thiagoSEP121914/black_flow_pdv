type Props = { label: string };

export default function TagChip({ label }: Props) {
  return (
    <span className="inline-flex items-center h-6 px-2 rounded-full border border-slate-200 bg-white text-[11px] font-semibold text-slate-700">
      {label}
    </span>
  );
}
