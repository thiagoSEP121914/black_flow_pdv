import { type AgendaPriority, priorityLabels } from "../types/agenda";

type Props = { priority: AgendaPriority; size?: "sm" | "md"; showLabel?: boolean };

const styles: Record<AgendaPriority, string> = {
  low: "bg-slate-100 text-slate-700 border-slate-200",
  medium: "bg-amber-100 text-amber-800 border-amber-200",
  high: "bg-red-100 text-red-800 border-red-200",
};

export default function PriorityBadge({ priority, size = "md", showLabel = true }: Props) {
  const s = size === "sm" ? "h-6 px-2 text-[11px]" : "h-7 px-2.5 text-xs";
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border font-semibold",
        s,
        styles[priority],
      ].join(" ")}
      title={priorityLabels[priority]}
    >
      {showLabel ? priorityLabels[priority] : "!"}
    </span>
  );
}
