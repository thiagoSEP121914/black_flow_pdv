import { Calendar, ClipboardList, MapPin, Phone, Truck, User, Wrench } from "lucide-react";
import { type AgendaEvent, eventTypeLabels } from "../types/agenda";
import StatusPill from "./StatusPill";
import PriorityBadge from "./PriorityBadge";
import TagChip from "./TagChip";

type Props = {
  events: AgendaEvent[];
  onEventClick: (event: AgendaEvent) => void;
};

const typeIcon = {
  delivery: Truck,
  service: Wrench,
  task: ClipboardList,
};

const fmtWeekday = (d: Date) =>
  new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(d);

const fmtDayMonth = (d: Date) =>
  new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short" }).format(d);

const fmtTime = (d: Date) =>
  new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(d);

export default function AgendaListView({ events, onEventClick }: Props) {
  if (!events.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-2">Nenhum evento encontrado</h3>
        <p className="text-sm text-slate-500">Não há eventos para os filtros selecionados.</p>
      </div>
    );
  }

  const grouped = events.reduce((acc, ev) => {
    const key = new Date(ev.startAt).toISOString().slice(0, 10);
    (acc[key] ||= []).push(ev);
    return acc;
  }, {} as Record<string, AgendaEvent[]>);

  const dateKeys = Object.keys(grouped).sort();

  return (
    <div className="space-y-6">
      {dateKeys.map((key) => {
        const dayDate = new Date(key + "T00:00:00");
        const items = grouped[key].slice().sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt));

        return (
          <div key={key}>
            {/* Date header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2">
                <p className="text-[11px] font-bold uppercase text-emerald-700">
                  {fmtWeekday(dayDate)}
                </p>
                <p className="text-lg font-black text-emerald-900">{fmtDayMonth(dayDate)}</p>
              </div>

              <div className="flex-1 h-px bg-slate-200" />

              <span className="text-xs text-slate-500">{items.length} evento(s)</span>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {items.map((ev) => {
                const Icon = typeIcon[ev.type];
                return (
                  <button
                    key={ev.id}
                    onClick={() => onEventClick(ev)}
                    className="w-full text-left rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md hover:border-emerald-200"
                  >
                    <div className="flex items-start gap-4">
                      {/* Time */}
                      <div className="shrink-0 text-center">
                        <p className="text-lg font-black text-slate-900">{fmtTime(new Date(ev.startAt))}</p>
                        <p className="text-xs text-slate-500">{fmtTime(new Date(ev.endAt))}</p>
                      </div>

                      <div className="w-px h-16 bg-slate-200 shrink-0" />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-700">
                            <Icon className="h-3.5 w-3.5" />
                            {eventTypeLabels[ev.type]}
                          </span>

                          <StatusPill status={ev.status} size="sm" />
                          <PriorityBadge priority={ev.priority} size="sm" showLabel={false} />
                        </div>

                        <h3 className="font-bold text-slate-900 truncate">{ev.title}</h3>

                        {ev.description && (
                          <p className="mt-1 text-sm text-slate-600 line-clamp-1">{ev.description}</p>
                        )}

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                          {ev.customerName && (
                            <span className="inline-flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {ev.customerName}
                            </span>
                          )}

                          {ev.address && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {ev.address.street}, {ev.address.number}
                            </span>
                          )}

                          {ev.customerPhone && (
                            <span className="inline-flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {ev.customerPhone}
                            </span>
                          )}
                        </div>

                        {ev.tags?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {ev.tags.map((t) => (
                              <TagChip key={t} label={t} />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
