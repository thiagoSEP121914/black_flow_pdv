import {
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  Edit,
  MapPin,
  Phone,
  PlayCircle,
  Store,
  Truck,
  User,
  Wrench,
  X,
} from "lucide-react";
import type { AgendaEvent } from "../types/agenda";
import { eventTypeLabels } from "../types/agenda";
import StatusPill from "./StatusPill";
import PriorityBadge from "./PriorityBadge";
import TagChip from "./TagChip";

type Props = {
  event: AgendaEvent | null;
  open: boolean;
  onClose: () => void;
  onEdit: (event: AgendaEvent) => void;
  onStatusChange: (event: AgendaEvent, status: AgendaEvent["status"]) => void;
  onCancel: (event: AgendaEvent) => void;
};

const typeIcon = {
  delivery: Truck,
  service: Wrench,
  task: ClipboardList,
};

const fmtDateLong = (d: Date) =>
  new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);

const fmtTime = (d: Date) =>
  new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(d);

export default function AgendaEventDrawer({
  event,
  open,
  onClose,
  onEdit,
  onStatusChange,
  onCancel,
}: Props) {
  if (!event) return null;

  const Icon = typeIcon[event.type];

  const showStart = event.status === "scheduled";
  const showComplete = event.status === "scheduled" || event.status === "in_progress";
  const showCancel = event.status !== "cancelled" && event.status !== "completed";

  return (
    <>
      {/* Backdrop */}
      <div
        className={[
          "fixed inset-0 z-40 bg-black/40 transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={[
          "fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white border-l border-slate-200 shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 border border-emerald-100 grid place-items-center">
              <Icon className="h-5 w-5 text-emerald-700" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase text-slate-500">
                {eventTypeLabels[event.type]}
              </p>
              <h2 className="text-lg font-black text-slate-900 truncate">{event.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-9 w-9 rounded-xl border border-slate-200 bg-white grid place-items-center hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            aria-label="Fechar"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-176px)]">
          {/* Status + Priority */}
          <div className="flex items-center gap-2">
            <StatusPill status={event.status} />
            <PriorityBadge priority={event.priority} />
          </div>

          {/* Tags */}
          {event.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.tags.map((t) => (
                <TagChip key={t} label={t} />
              ))}
            </div>
          )}

          {/* Date/Time */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-slate-500" />
              <p className="text-sm font-bold text-slate-900 capitalize">
                {fmtDateLong(new Date(event.startAt))}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-slate-500" />
              <p className="text-sm text-slate-700">
                {fmtTime(new Date(event.startAt))} – {fmtTime(new Date(event.endAt))}
              </p>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div>
              <p className="text-xs font-bold uppercase text-slate-500 mb-2">Descrição</p>
              <p className="text-sm text-slate-700">{event.description}</p>
            </div>
          )}

          {/* Customer */}
          {(event.customerName || event.customerPhone) && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase text-slate-500 mb-3">Cliente</p>

              {event.customerName && (
                <div className="flex items-center gap-2 text-sm text-slate-800">
                  <User className="h-4 w-4 text-slate-500" />
                  <span className="font-bold">{event.customerName}</span>
                </div>
              )}

              {event.customerPhone && (
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-700">
                  <Phone className="h-4 w-4 text-slate-500" />
                  <span>{event.customerPhone}</span>
                </div>
              )}
            </div>
          )}

          {/* Address */}
          {event.address && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase text-slate-500 mb-3">Endereço</p>

              <div className="flex items-start gap-2 text-sm text-slate-700">
                <MapPin className="h-4 w-4 text-slate-500 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">
                    {event.address.street}, {event.address.number}
                  </p>
                  {(event.address.neighborhood || event.address.city) && (
                    <p className="text-slate-600">
                      {event.address.neighborhood ? `${event.address.neighborhood} — ` : ""}
                      {event.address.city}/{event.address.state}
                    </p>
                  )}
                  <p className="text-slate-500">{event.address.zip}</p>
                </div>
              </div>
            </div>
          )}

          {/* Order */}
          {event.orderId && (
            <div className="rounded-2xl border border-slate-200 bg-sky-50 p-4 flex items-center gap-2">
              <Store className="h-4 w-4 text-sky-700" />
              <p className="text-sm text-slate-800">
                Vinculado ao pedido <b>#{event.orderId}</b>
              </p>
            </div>
          )}

          {/* Delivery fee */}
          {typeof event.deliveryFee === "number" && event.deliveryFee > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-between">
              <span className="text-sm text-slate-600">Taxa de entrega</span>
              <span className="text-sm font-black text-emerald-700">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(event.deliveryFee)}
              </span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-white">
          <div className="flex flex-wrap gap-2">
            {showStart && (
              <button
                onClick={() => onStatusChange(event, "in_progress")}
                className="h-10 flex-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-sm text-slate-800 flex items-center justify-center gap-2"
              >
                <PlayCircle className="h-4 w-4" />
                Iniciar
              </button>
            )}

            {showComplete && (
              <button
                onClick={() => onStatusChange(event, "completed")}
                className="h-10 flex-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-sm text-slate-800 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Concluir
              </button>
            )}

            <button
              onClick={() => onEdit(event)}
              className="h-10 flex-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-sm text-slate-800 flex items-center justify-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar
            </button>

            {showCancel && (
              <button
                onClick={() => onCancel(event)}
                className="h-10 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 font-bold text-sm text-red-700 px-4 flex items-center justify-center gap-2"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
