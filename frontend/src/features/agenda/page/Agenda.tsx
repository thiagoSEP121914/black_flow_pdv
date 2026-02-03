import { useMemo, useState } from "react";
import {
    Calendar as CalendarIcon,
    List as ListIcon,
    Plus,
    Search,
    SlidersHorizontal,
} from "lucide-react";

import type { AgendaEvent, AgendaFilters } from "../types/agenda";
import AgendaCalendarView from "../components/AgendaCalendarView";

import AgendaEventDrawer from "../components/AgendaEventDrawer";
import AgendaListView from "../components/AgendaListView";
import AgendaEventModal from "../components/AgendaEventModal";
import type { AgendaEventFormData } from "../types/agenda";



type QuickFilter = "today" | "week" | "month";
type CalendarView = "day" | "week" | "month";

/** helpers sem date-fns */
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

const startOfWeek = (d: Date) => {
    const base = startOfDay(d);
    const day = base.getDay(); // 0 dom ... 6 sáb
    const diff = day === 0 ? -6 : 1 - day; // semana começando na segunda
    base.setDate(base.getDate() + diff);
    return base;
};

const endOfWeek = (d: Date) => {
    const s = startOfWeek(d);
    const e = new Date(s);
    e.setDate(e.getDate() + 6);
    return endOfDay(e);
};

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

const isWithin = (date: Date, start: Date, end: Date) => date >= start && date <= end;

const withTime = (base: Date, h: number, m = 0) => {
    const d = new Date(base);
    d.setHours(h, m, 0, 0);
    return d;
};

const addDays = (base: Date, days: number) => {
    const d = new Date(base);
    d.setDate(d.getDate() + days);
    return d;
};

const parseHHMM = (value: string) => {
    const [hh, mm] = value.split(":").map((x) => Number(x));
    return { h: Number.isFinite(hh) ? hh : 0, m: Number.isFinite(mm) ? mm : 0 };
};

const Agenda = () => {
    // Header state
    const [search, setSearch] = useState("");
    const [quickFilter, setQuickFilter] = useState<QuickFilter>("week");
    const [view, setView] = useState<CalendarView>("week");
    const [listMode, setListMode] = useState(true);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<AgendaEvent | null>(null);

    // Filters state
    const [filters, setFilters] = useState<AgendaFilters>({});

    // Drawer state
    const [selectedEvent, setSelectedEvent] = useState<AgendaEvent | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [cursorDate, setCursorDate] = useState(() => new Date());

    // Mock options (MVP 1 — depois vira API)
    const stores = useMemo(
        () => [
            { id: "all", name: "Todas as lojas" },
            { id: "1", name: "Mercadinho Central" },
            { id: "2", name: "Farmácia Saúde" },
        ],
        []
    );

    const assignees = useMemo(
        () => [
            { id: "all", name: "Todos" },
            { id: "1", name: "João Silva" },
            { id: "2", name: "Maria Santos" },
            { id: "3", name: "Carlos Oliveira" },
        ],
        []
    );

    // options para o modal (sem "all")
    const storeOptions = useMemo(() => stores.filter((s) => s.id !== "all"), [stores]);
    const assigneeOptions = useMemo(() => assignees.filter((a) => a.id !== "all"), [assignees]);

    const [events, setEvents] = useState<AgendaEvent[]>(() => {
        const today = new Date();

        return [
            {
                id: "1",
                type: "delivery",
                title: "Entrega Pedido #1234",
                description: "Pedido grande com 15 itens. Cliente pediu para deixar na portaria.",
                startAt: withTime(today, 9, 0),
                endAt: withTime(today, 10, 0),
                status: "scheduled",
                priority: "high",
                tags: ["Urgente", "Pedido grande"],
                storeId: "1",
                assigneeId: "1",
                customerName: "Ana Paula",
                customerPhone: "(11) 99999-1234",
                address: {
                    id: "a1",
                    street: "Rua das Flores",
                    number: "123",
                    neighborhood: "Centro",
                    city: "São Paulo",
                    state: "SP",
                    zip: "01234-567",
                },
                orderId: "1234",
                deliveryFee: 8.5,
                createdAt: new Date(),
                createdBy: "admin",
            },
            {
                id: "2",
                type: "task",
                title: "Inventário Setor Bebidas",
                description: "Conferir estoque de refrigerantes e cervejas",
                startAt: withTime(today, 14, 0),
                endAt: withTime(today, 16, 0),
                status: "scheduled",
                priority: "medium",
                tags: ["Inventário"],
                storeId: "1",
                assigneeId: "2",
                createdAt: new Date(),
                createdBy: "admin",
            },
            {
                id: "3",
                type: "delivery",
                title: "Entrega Medicamentos",
                description: "Medicamentos controlados — necessário RG",
                startAt: withTime(today, 11, 0),
                endAt: withTime(today, 12, 0),
                status: "in_progress",
                priority: "high",
                tags: ["Controlado"],
                storeId: "2",
                assigneeId: "3",
                customerName: "Roberto Almeida",
                customerPhone: "(11) 98888-5678",
                address: {
                    id: "a2",
                    street: "Av. Brasil",
                    number: "456",
                    neighborhood: "Jardim",
                    city: "São Paulo",
                    state: "SP",
                    zip: "04567-890",
                    complement: "Apto 12B",
                },
                createdAt: new Date(),
                createdBy: "admin",
            },
            {
                id: "4",
                type: "service",
                title: "Atendimento Cliente VIP",
                description: "Separar e conferir lista de compras mensal",
                startAt: withTime(addDays(today, 1), 10, 0),
                endAt: withTime(addDays(today, 1), 11, 0),
                status: "scheduled",
                priority: "low",
                tags: ["Cliente VIP"],
                storeId: "1",
                assigneeId: "1",
                customerName: "Empresa ABC Ltda",
                customerPhone: "(11) 3333-4444",
                createdAt: new Date(),
                createdBy: "admin",
            },
            {
                id: "5",
                type: "task",
                title: "Verificar Validades",
                description: "Produtos com validade próxima no setor de laticínios",
                startAt: withTime(addDays(today, 2), 8, 0),
                endAt: withTime(addDays(today, 2), 10, 0),
                status: "scheduled",
                priority: "high",
                tags: ["Urgente", "Validade"],
                storeId: "1",
                assigneeId: "2",
                createdAt: new Date(),
                createdBy: "admin",
            },
        ];
    });

    const filteredEvents = useMemo(() => {
        const s = search.trim().toLowerCase();

        // intervalo do quickFilter
        const base = cursorDate;
        const interval =
            view === "day"
                ? { start: startOfDay(base), end: endOfDay(base) }
                : view === "month"
                    ? { start: startOfMonth(base), end: endOfMonth(base) }
                    : { start: startOfWeek(base), end: endOfWeek(base) };


        return events.filter((ev) => {
            // quick filter por data (por startAt)
            if (!isWithin(ev.startAt, interval.start, interval.end)) return false;

            // search
            if (s) {
                const hit =
                    ev.title.toLowerCase().includes(s) ||
                    (ev.description?.toLowerCase().includes(s) ?? false) ||
                    (ev.customerName?.toLowerCase().includes(s) ?? false) ||
                    (ev.customerPhone?.toLowerCase().includes(s) ?? false);
                if (!hit) return false;
            }

            if (filters.storeId && ev.storeId !== filters.storeId) return false;
            if (filters.assigneeId && ev.assigneeId !== filters.assigneeId) return false;
            if (filters.type && ev.type !== filters.type) return false;
            if (filters.status && ev.status !== filters.status) return false;
            if (filters.priority && ev.priority !== filters.priority) return false;

            return true;
        });
    }, [events, filters, search, quickFilter]);

    const handleNew = () => {
        setEditingEvent(null);
        setModalOpen(true);
    };

    const handleEdit = (evt: AgendaEvent) => {
        setEditingEvent(evt);
        setModalOpen(true);
    };

    const handleSave = (data: AgendaEventFormData) => {
        const baseDate = data.date; // ✅ já é Date
        const st = parseHHMM(data.startTime);
        const et = parseHHMM(data.endTime);

        const startAt = withTime(baseDate, st.h, st.m);
        let endAt = withTime(baseDate, et.h, et.m);

        if (endAt <= startAt) {
            endAt = new Date(endAt);
            endAt.setDate(endAt.getDate() + 1);
        }

        const isEditing = Boolean(editingEvent);

        setEvents((prev) => {
            if (!isEditing) {
                const id =
                    typeof crypto !== "undefined" && "randomUUID" in crypto
                        ? crypto.randomUUID()
                        : String(Date.now());

                const created: AgendaEvent = {
                    id,
                    type: data.type,
                    title: data.title,
                    description: data.description?.trim() || undefined,
                    startAt,
                    endAt,
                    status: "scheduled",
                    priority: data.priority,
                    tags: data.tags,
                    storeId: data.storeId,
                    assigneeId: data.assigneeId,
                    customerName: data.customerName?.trim() || undefined,
                    customerPhone: data.customerPhone?.trim() || undefined,
                    orderId: data.orderId?.trim() || undefined,
                    deliveryFee: data.deliveryFee,
                    createdAt: new Date(),
                    createdBy: "admin",
                };

                return [created, ...prev];
            }

            return prev.map((x) => {
                if (x.id !== editingEvent!.id) return x;
                return {
                    ...x,
                    type: data.type,
                    title: data.title,
                    description: data.description?.trim() || undefined,
                    startAt,
                    endAt,
                    priority: data.priority,
                    tags: data.tags,
                    storeId: data.storeId,
                    assigneeId: data.assigneeId,
                    customerName: data.customerName?.trim() || undefined,
                    customerPhone: data.customerPhone?.trim() || undefined,
                    orderId: data.orderId?.trim() || undefined,
                    deliveryFee: data.deliveryFee,
                    updatedAt: new Date(),
                };
            });
        });

        setModalOpen(false);
        setEditingEvent(null);
    };

    const onEventClick = (ev: AgendaEvent) => {
        setSelectedEvent(ev);
        setDrawerOpen(true);
    };

    const onStatusChange = (ev: AgendaEvent, status: AgendaEvent["status"]) => {
        setEvents((prev) =>
            prev.map((x) => (x.id === ev.id ? { ...x, status, updatedAt: new Date() } : x))
        );
        setSelectedEvent((prev) => (prev?.id === ev.id ? { ...prev, status } : prev));
    };

    const onCancel = (ev: AgendaEvent) => {
        const reason = window.prompt("Motivo do cancelamento (obrigatório):");
        if (!reason || !reason.trim()) return;

        setEvents((prev) =>
            prev.map((x) =>
                x.id === ev.id
                    ? { ...x, status: "cancelled", cancelReason: reason.trim(), updatedAt: new Date() }
                    : x
            )
        );
        setSelectedEvent((prev) =>
            prev?.id === ev.id ? { ...prev, status: "cancelled", cancelReason: reason.trim() } : prev
        );
    };

    const onEditFromDrawer = () => {
        if (!selectedEvent) return;
        setDrawerOpen(false);
        handleEdit(selectedEvent);
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50">
            <div className="mx-auto max-w-[1400px] px-6 py-6 space-y-6">
                {/* HEADER */}
                <div className="space-y-4">
                    {/* Row 1: Title + Search + CTA */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-2xl">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Buscar eventos, clientes, entregas..."
                                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/30"
                                />
                            </div>

                            <button
                                onClick={handleNew}
                                className="h-10 shrink-0 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 flex items-center justify-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">Novo Agendamento</span>
                                <span className="sm:hidden">Novo</span>
                            </button>
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        {/* Quick Filters */}
                        <div className="flex items-center gap-2">
                            {[
                                { key: "today" as const, label: "Hoje" },
                                { key: "week" as const, label: "Semana" },
                                { key: "month" as const, label: "Mês" },
                            ].map((f) => {
                                const active = quickFilter === f.key;
                                return (
                                    <button
                                        key={f.key}
                                        onClick={() => {
                                            setQuickFilter(f.key);
                                            if (f.key === "today") setView("day");
                                            if (f.key === "week") setView("week");
                                            if (f.key === "month") setView("month");
                                        }}
                                        className={[
                                            "h-9 rounded-xl px-3 text-sm font-semibold border transition",
                                            active
                                                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
                                        ].join(" ")}
                                    >
                                        {f.label}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Calendar/List */}
                            <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1">
                                <button
                                    onClick={() => setListMode(false)}
                                    className={[
                                        "h-8 w-9 rounded-lg grid place-items-center transition",
                                        !listMode ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50",
                                    ].join(" ")}
                                    aria-label="Calendário"
                                >
                                    <CalendarIcon className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setListMode(true)}
                                    className={[
                                        "h-8 w-9 rounded-lg grid place-items-center transition",
                                        listMode ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50",
                                    ].join(" ")}
                                    aria-label="Lista"
                                >
                                    <ListIcon className="h-4 w-4" />
                                </button>
                            </div>

                            {/* View selector (somente calendário) */}
                            {!listMode && (
                                <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1">
                                    {[
                                        { key: "day" as const, label: "Dia" },
                                        { key: "week" as const, label: "Semana" },
                                        { key: "month" as const, label: "Mês" },
                                    ].map((opt) => {
                                        const active = view === opt.key;
                                        return (
                                            <button
                                                key={opt.key}
                                                onClick={() => setView(opt.key)}
                                                className={[
                                                    "h-8 rounded-lg px-3 text-xs font-semibold transition",
                                                    active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50",
                                                ].join(" ")}
                                            >
                                                {opt.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* MAIN */}
                <div className="flex flex-col gap-6 lg:flex-row">
                    {/* Filters Panel */}
                    <aside className="w-full shrink-0 lg:w-72">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <SlidersHorizontal className="h-4 w-4 text-slate-500" />
                                    <span className="text-sm font-bold text-slate-900">Filtros</span>
                                </div>
                                <button
                                    onClick={() => setFilters({})}
                                    className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                                >
                                    Limpar
                                </button>
                            </div>

                            {/* Loja */}
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-slate-500">Loja</p>
                                <select
                                    value={filters.storeId ?? "all"}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            storeId: e.target.value === "all" ? undefined : e.target.value,
                                        }))
                                    }
                                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
                                >
                                    {stores.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Responsável */}
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-slate-500">Responsável</p>
                                <select
                                    value={filters.assigneeId ?? "all"}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            assigneeId: e.target.value === "all" ? undefined : e.target.value,
                                        }))
                                    }
                                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
                                >
                                    {assignees.map((a) => (
                                        <option key={a.id} value={a.id}>
                                            {a.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Tipo */}
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-slate-500">Tipo</p>
                                <select
                                    value={filters.type ?? "all"}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            type: e.target.value === "all" ? undefined : (e.target.value as any),
                                        }))
                                    }
                                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
                                >
                                    <option value="all">Todos os tipos</option>
                                    <option value="delivery">Entrega</option>
                                    <option value="service">Serviço</option>
                                    <option value="task">Tarefa</option>
                                </select>
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-slate-500">Status</p>
                                <select
                                    value={filters.status ?? "all"}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            status: e.target.value === "all" ? undefined : (e.target.value as any),
                                        }))
                                    }
                                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
                                >
                                    <option value="all">Todos</option>
                                    <option value="scheduled">Agendado</option>
                                    <option value="in_progress">Em andamento</option>
                                    <option value="completed">Concluído</option>
                                    <option value="cancelled">Cancelado</option>
                                </select>
                            </div>

                            {/* Prioridade */}
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-slate-500">Prioridade</p>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { key: "low" as const, label: "Baixa" },
                                        { key: "medium" as const, label: "Média" },
                                        { key: "high" as const, label: "Alta" },
                                    ].map((p) => {
                                        const active = filters.priority === p.key;
                                        return (
                                            <button
                                                key={p.key}
                                                onClick={() =>
                                                    setFilters((prev) => ({ ...prev, priority: active ? undefined : p.key }))
                                                }
                                                className={[
                                                    "h-8 rounded-xl px-3 text-xs font-bold border transition",
                                                    active
                                                        ? "bg-slate-900 text-white border-slate-900"
                                                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
                                                ].join(" ")}
                                            >
                                                {p.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Content */}
                    <main className="flex-1 min-w-0">
                        {listMode ? (
                            <AgendaListView events={filteredEvents} onEventClick={onEventClick} />
                        ) : (
                            <AgendaCalendarView
                                view={view}
                                cursorDate={cursorDate}
                                onCursorDateChange={setCursorDate}
                                events={filteredEvents}
                                onEventClick={onEventClick}
                            />
                        )}
                    </main>
                </div>
            </div>

            {/* Drawer */}
            <AgendaEventDrawer
                event={selectedEvent}
                open={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setSelectedEvent(null);
                }}
                onEdit={onEditFromDrawer}
                onStatusChange={onStatusChange}
                onCancel={onCancel}
            />

            {/* Modal */}
            <AgendaEventModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                event={editingEvent}
                onSave={handleSave}
                stores={storeOptions}
                assignees={assigneeOptions}
            />
        </div>
    );
};

export default Agenda;
