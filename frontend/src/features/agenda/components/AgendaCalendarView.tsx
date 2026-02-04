import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AgendaEvent } from "../types/agenda";

type CalendarView = "day" | "week" | "month";

interface AgendaCalendarViewProps {
    view: CalendarView;
    cursorDate: Date;
    onCursorDateChange: (d: Date) => void;
    events: AgendaEvent[];
    onEventClick: (ev: AgendaEvent) => void;
}

/** helpers (sem date-fns) */
const pad2 = (n: number) => String(n).padStart(2, "0");

const toKey = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

const addDays = (base: Date, days: number) => {
    const d = new Date(base);
    d.setDate(d.getDate() + days);
    return d;
};

// Semana começando no DOMINGO (igual print)
const startOfWeek = (d: Date) => {
    const base = startOfDay(d);
    const day = base.getDay(); // 0 dom ... 6 sáb
    base.setDate(base.getDate() - day);
    return base;
};

const endOfWeek = (d: Date) => endOfDay(addDays(startOfWeek(d), 6));

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const formatTimeHHMM = (d: Date) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

const ptShort = (d: Date) =>
    new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short" }).format(d).replace(".", "");

const ptShortWithYear = (d: Date) =>
    new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short", year: "numeric" }).format(d).replace(".", "");

const buildRangeTitle = (view: CalendarView, cursorDate: Date) => {
    if (view === "day") return ptShortWithYear(cursorDate);

    if (view === "week") {
        const s = startOfWeek(cursorDate);
        const e = endOfWeek(cursorDate);
        const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();

        if (sameMonth) {
            // 1–7 fev 2026
            const monthYear = new Intl.DateTimeFormat("pt-BR", { month: "short", year: "numeric" })
                .format(e)
                .replace(".", "");
            return `${s.getDate()}–${e.getDate()} ${monthYear}`;
        }

        // 28 jan – 3 fev 2026
        return `${ptShort(s)} – ${ptShortWithYear(e)}`;
    }

    // month
    return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(cursorDate);
};

const dayNames = ["DOMINGO", "SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO"];

const typePillClass = (type: AgendaEvent["type"]) => {
    if (type === "delivery") return "border-emerald-300 bg-emerald-50 text-emerald-900";
    if (type === "service") return "border-amber-300 bg-amber-50 text-amber-900";
    return "border-slate-200 bg-white text-slate-900";
};

export default function AgendaCalendarView({
    view,
    cursorDate,
    onCursorDateChange,
    events,
    onEventClick,
}: AgendaCalendarViewProps) {
    const today = new Date();

    const { rangeStart, rangeEnd } = useMemo(() => {
        if (view === "day") return { rangeStart: startOfDay(cursorDate), rangeEnd: endOfDay(cursorDate) };
        if (view === "week") return { rangeStart: startOfWeek(cursorDate), rangeEnd: endOfWeek(cursorDate) };
        return { rangeStart: startOfMonth(cursorDate), rangeEnd: endOfMonth(cursorDate) };
    }, [view, cursorDate]);

    const rangeLabel = useMemo(() => {
        const fmt = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short" });

        if (view === "day") return fmt.format(cursorDate);

        // week/month -> "1 fev - 7 fev"
        return `${fmt.format(rangeStart)} - ${fmt.format(rangeEnd)}`;
    }, [view, cursorDate, rangeStart, rangeEnd]);


    const eventsByDay = useMemo(() => {
        const map = new Map<string, AgendaEvent[]>();
        for (const ev of events) {
            // agrupa por startAt (dia)
            const k = toKey(ev.startAt);
            const arr = map.get(k) ?? [];
            arr.push(ev);
            map.set(k, arr);
        }
        // ordena por horário
        for (const [k, arr] of map.entries()) {
            arr.sort((a, b) => a.startAt.getTime() - b.startAt.getTime());
            map.set(k, arr);
        }
        return map;
    }, [events]);

    const goToday = () => onCursorDateChange(new Date());

    const shift = (dir: -1 | 1) => {
        if (view === "day") return onCursorDateChange(addDays(cursorDate, dir));
        if (view === "week") return onCursorDateChange(addDays(cursorDate, dir * 7));

        // month
        const d = new Date(cursorDate);
        d.setDate(1);
        d.setMonth(d.getMonth() + dir);
        onCursorDateChange(d);
    };

    const title = buildRangeTitle(view, cursorDate);

    // Dias para renderizar
    const daysToRender = useMemo(() => {
        if (view === "day") return [startOfDay(cursorDate)];

        if (view === "week") {
            const s = startOfWeek(cursorDate);
            return Array.from({ length: 7 }, (_, i) => addDays(s, i));
        }

        // month grid (começa no domingo da semana que contém o dia 1)
        const monthStart = startOfMonth(cursorDate);
        const monthEnd = endOfMonth(cursorDate);

        const gridStart = startOfWeek(monthStart);
        const gridEnd = endOfWeek(monthEnd);

        const out: Date[] = [];
        for (let d = new Date(gridStart); d <= gridEnd; d = addDays(d, 1)) {
            out.push(new Date(d));
        }
        return out;
    }, [view, cursorDate]);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            {/* Header do calendário */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => shift(-1)}
                        className="h-9 w-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 grid place-items-center"
                        aria-label="Anterior"
                    >
                        <ChevronLeft className="h-4 w-4 text-slate-700" />
                    </button>

                    <button
                        type="button"
                        onClick={() => shift(1)}
                        className="h-9 w-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 grid place-items-center"
                        aria-label="Próximo"
                    >
                        <ChevronRight className="h-4 w-4 text-slate-700" />
                    </button>

                    <button
                        type="button"
                        onClick={goToday}
                        className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Hoje
                    </button>

                    <span className="ml-2 text-sm font-bold text-slate-900">{title}</span>
                </div>
                <div className="text-sm font-semibold text-slate-900">
                    {rangeLabel}
                </div>

            </div>

            {/* Cabeçalho dias da semana (week/month) */}
            {view !== "day" && (
                <div className="mt-4 grid grid-cols-7 border border-slate-200 rounded-xl overflow-hidden">
                    {dayNames.map((name) => (
                        <div
                            key={name}
                            className="bg-slate-50 px-3 py-2 text-[11px] font-bold text-slate-500 border-r border-slate-200 last:border-r-0"
                        >
                            {name}
                        </div>
                    ))}

                    {/* Corpo */}
                    {view === "week" && (
                        <>
                            {daysToRender.map((day) => {
                                const k = toKey(day);
                                const dayEvents = eventsByDay.get(k) ?? [];

                                const isToday = isSameDay(day, today);

                                return (
                                    <div
                                        key={k}
                                        className={[
                                            "min-h-[420px] p-3 border-t border-slate-200 border-r border-slate-200 last:border-r-0",
                                            isToday ? "bg-emerald-50/40" : "bg-white",
                                        ].join(" ")}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={[
                                                    "text-sm font-bold",
                                                    isToday ? "text-emerald-700" : "text-slate-900",
                                                ].join(" ")}
                                            >
                                                {day.getDate()}
                                            </span>
                                        </div>

                                        <div className="mt-2 space-y-2">
                                            {dayEvents.map((ev) => (
                                                <button
                                                    key={ev.id}
                                                    type="button"
                                                    onClick={() => onEventClick(ev)}
                                                    className={[
                                                        "w-full rounded-xl border px-3 py-2 text-left shadow-sm hover:shadow transition",
                                                        typePillClass(ev.type),
                                                    ].join(" ")}
                                                    title={ev.title}
                                                >
                                                    <div className="text-xs font-semibold truncate">{ev.title}</div>
                                                    <div className="text-[11px] text-slate-500">{formatTimeHHMM(ev.startAt)}</div>
                                                </button>
                                            ))}

                                            {dayEvents.length === 0 && (
                                                <div className="text-xs text-slate-400 mt-2">Sem eventos</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}

                    {view === "month" && (
                        <>
                            {daysToRender.map((day) => {
                                const k = toKey(day);
                                const dayEvents = eventsByDay.get(k) ?? [];

                                const inMonth = day.getMonth() === cursorDate.getMonth();
                                const isToday = isSameDay(day, today);

                                const visible = dayEvents.slice(0, 3);
                                const hidden = Math.max(0, dayEvents.length - visible.length);

                                return (
                                    <div
                                        key={k}
                                        className={[
                                            "min-h-[120px] p-2 border-t border-slate-200 border-r border-slate-200 last:border-r-0",
                                            inMonth ? "bg-white" : "bg-slate-50",
                                            isToday ? "ring-1 ring-emerald-300" : "",
                                        ].join(" ")}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={[
                                                    "text-xs font-bold",
                                                    inMonth ? "text-slate-900" : "text-slate-400",
                                                ].join(" ")}
                                            >
                                                {day.getDate()}
                                            </span>
                                        </div>

                                        <div className="mt-2 space-y-1">
                                            {visible.map((ev) => (
                                                <button
                                                    key={ev.id}
                                                    type="button"
                                                    onClick={() => onEventClick(ev)}
                                                    className={[
                                                        "w-full rounded-lg border px-2 py-1 text-left hover:shadow-sm transition",
                                                        typePillClass(ev.type),
                                                    ].join(" ")}
                                                    title={ev.title}
                                                >
                                                    <div className="text-[11px] font-semibold truncate">{ev.title}</div>
                                                    <div className="text-[10px] text-slate-500">{formatTimeHHMM(ev.startAt)}</div>
                                                </button>
                                            ))}

                                            {hidden > 0 && (
                                                <div className="text-[11px] font-semibold text-slate-500">+{hidden} mais</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
            )}

            {/* Day view */}
            {view === "day" && (
                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-bold text-slate-900">{ptShortWithYear(cursorDate)}</div>
                        <div className="text-xs text-slate-500">
                            {eventsByDay.get(toKey(cursorDate))?.length ?? 0} evento(s)
                        </div>
                    </div>

                    <div className="mt-3 space-y-2">
                        {(eventsByDay.get(toKey(cursorDate)) ?? []).map((ev) => (
                            <button
                                key={ev.id}
                                type="button"
                                onClick={() => onEventClick(ev)}
                                className={[
                                    "w-full rounded-xl border px-3 py-3 text-left shadow-sm hover:shadow transition",
                                    typePillClass(ev.type),
                                ].join(" ")}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="text-sm font-bold truncate">{ev.title}</div>
                                        <div className="text-xs text-slate-500">{formatTimeHHMM(ev.startAt)} – {formatTimeHHMM(ev.endAt)}</div>
                                    </div>
                                    <span className="text-xs font-semibold text-slate-600">{ev.type}</span>
                                </div>
                            </button>
                        ))}

                        {(eventsByDay.get(toKey(cursorDate)) ?? []).length === 0 && (
                            <div className="text-sm text-slate-500">Sem eventos nesse dia.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
