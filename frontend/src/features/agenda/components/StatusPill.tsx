import { type AgendaEventStatus, eventStatusLabels } from "../types/agenda";

type Props = { status: AgendaEventStatus; size?: "sm" | "md" };

const styles: Record<AgendaEventStatus, string> = {
  scheduled: "bg-slate-100 text-slate-700 border-slate-200",
  in_progress: "bg-amber-100 text-amber-800 border-amber-200",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

export default function StatusPill({ status, size = "md" }: Props) {
  const s = size === "sm" ? "h-6 px-2 text-[11px]" : "h-7 px-2.5 text-xs";
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border font-semibold",
        s,
        styles[status],
      ].join(" ")}
    >
      {eventStatusLabels[status]}
    </span>
  );
}
