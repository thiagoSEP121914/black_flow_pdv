import { useEffect, useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardList, Truck, Wrench, X, Plus } from "lucide-react";

import type { AgendaEvent, AgendaEventFormData, AgendaEventType, AgendaPriority } from "../types/agenda";
import { eventTypeLabels, priorityLabels } from "../types/agenda";
import {
  agendaEventFormSchema,
  type AgendaEventFormInput,
  type AgendaEventFormValues,
} from "../schemas/agendaEventSchema";


type Option = { id: string; name: string };

interface AgendaEventModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    event?: AgendaEvent | null; // se vier preenchido, é edição
    stores: Option[];
    assignees: Option[];
    onSave: (data: AgendaEventFormData) => void;
}

const typeIcons: Record<AgendaEventType, any> = {
    delivery: Truck,
    service: Wrench,
    task: ClipboardList,
};

const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 10) return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
};

const formatZip = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    return digits.replace(/(\d{5})(\d{0,3})/, "$1-$2");
};

const toISODateInput = (d: Date) => {
    // evita dependência do date-fns; funciona ok pro input
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const AgendaEventModal = ({
    open,
    onOpenChange,
    event,
    stores,
    assignees,
    onSave,
}: AgendaEventModalProps) => {
    const isEditing = !!event;

    const defaultValues: AgendaEventFormValues = useMemo(() => {
        if (event) {
            const start = new Date(event.startAt);
            const end = new Date(event.endAt);

            const startTime = `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`;
            const endTime = `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`;

            return {
                type: event.type,
                title: event.title,
                description: event.description ?? "",
                date: toISODateInput(start),
                startTime,
                endTime,
                priority: event.priority,
                tags: event.tags ?? [],
                storeId: event.storeId,
                assigneeId: event.assigneeId,
                customerName: event.customerName ?? "",
                customerPhone: event.customerPhone ?? "",
                street: event.address?.street ?? "",
                number: event.address?.number ?? "",
                neighborhood: event.address?.neighborhood ?? "",
                city: event.address?.city ?? "",
                state: event.address?.state ?? "",
                zip: event.address?.zip ?? "",
                complement: event.address?.complement ?? "",
                orderId: event.orderId ?? "",
                deliveryFee: event.deliveryFee ?? 0,
            };
        }

        const now = new Date();
        return {
            type: "delivery",
            title: "",
            description: "",
            date: toISODateInput(now),
            startTime: "09:00",
            endTime: "10:00",
            priority: "medium",
            tags: [],
            storeId: stores[0]?.id ?? "",
            assigneeId: assignees[0]?.id ?? "",
            customerName: "",
            customerPhone: "",
            street: "",
            number: "",
            neighborhood: "",
            city: "",
            state: "",
            zip: "",
            complement: "",
            orderId: "",
            deliveryFee: 0,
        };
    }, [event, stores, assignees]);

const {
  register,
  handleSubmit,
  setValue,
  watch,
  reset,
  formState: { errors, isSubmitting },
} = useForm<AgendaEventFormInput, any, AgendaEventFormValues>({
  resolver: zodResolver(agendaEventFormSchema),
  defaultValues, // pode manter como você já montou
  mode: "onSubmit",
});


    const [tagInput, setTagInput] = useState("");

    const type = watch("type");
    const tags = watch("tags");
    const priority = watch("priority");

    const showCustomer = type === "delivery" || type === "service";
    const showAddress = type === "delivery";

    useEffect(() => {
        if (open) {
            reset(defaultValues);
            setTagInput("");
        }
    }, [open, reset, defaultValues]);

    useEffect(() => {
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onOpenChange(false);
        };
        if (open) window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, [open, onOpenChange]);

    if (!open) return null;

    const addTag = () => {
        const v = tagInput.trim();
        if (!v) return;
        if (tags?.includes(v)) return;
        setValue("tags", [...(tags ?? []), v], { shouldDirty: true });
        setTagInput("");
    };

    const removeTag = (t: string) => {
        setValue("tags", (tags ?? []).filter((x) => x !== t), { shouldDirty: true });
    };

const submit: SubmitHandler<AgendaEventFormValues> = (values) => {
  const dateObj = new Date(values.date + "T00:00:00");

  const payload: AgendaEventFormData = {
    type: values.type,
    title: values.title,
    description: values.description?.trim() ? values.description.trim() : undefined,

    date: dateObj,
    startTime: values.startTime,
    endTime: values.endTime,

    priority: values.priority as AgendaPriority,
    tags: values.tags ?? [],
    storeId: values.storeId,
    assigneeId: values.assigneeId,

    customerName: values.customerName?.trim() ? values.customerName.trim() : undefined,
    customerPhone: values.customerPhone?.trim() ? values.customerPhone.trim() : undefined,

    street: values.street?.trim() ? values.street.trim() : undefined,
    number: values.number?.trim() ? values.number.trim() : undefined,
    neighborhood: values.neighborhood?.trim() ? values.neighborhood.trim() : undefined,
    city: values.city?.trim() ? values.city.trim() : undefined,
    state: values.state?.trim() ? values.state.trim() : undefined,
    zip: values.zip?.trim() ? values.zip.trim() : undefined,
    complement: values.complement?.trim() ? values.complement.trim() : undefined,

    orderId: values.orderId?.trim() ? values.orderId.trim() : undefined,
    deliveryFee: values.deliveryFee ?? 0,
  };

  onSave(payload);
  onOpenChange(false);
};


    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <button
                aria-label="Fechar modal"
                className="absolute inset-0 bg-black/40"
                onClick={() => onOpenChange(false)}
            />

            {/* Panel */}
            <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 rounded-t-2xl">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            {isEditing ? "Editar Agendamento" : "Novo Agendamento"}
                        </h2>
                        <p className="text-sm text-slate-600">
                            Preencha os dados essenciais da operação (entrega, serviço ou tarefa).
                        </p>
                    </div>

                    <button
                        onClick={() => onOpenChange(false)}
                        className="rounded-xl p-2 hover:bg-slate-200/60 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <X className="h-5 w-5 text-slate-700" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(submit)} className="max-h-[75vh] overflow-y-auto px-6 py-5">
                    {/* Tipo */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-800">Tipo de agendamento</p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {(Object.keys(eventTypeLabels) as AgendaEventType[]).map((t) => {
                                const Icon = typeIcons[t];
                                const selected = type === t;
                                return (
                                    <button
                                        type="button"
                                        key={t}
                                        onClick={() => setValue("type", t, { shouldDirty: true })}
                                        className={[
                                            "flex items-center gap-3 rounded-2xl border p-4 text-left transition",
                                            selected
                                                ? "border-emerald-400 bg-emerald-50"
                                                : "border-slate-200 bg-white hover:border-emerald-200 hover:bg-slate-50",
                                        ].join(" ")}
                                    >
                                        <span
                                            className={[
                                                "flex h-10 w-10 items-center justify-center rounded-xl",
                                                selected ? "bg-emerald-100" : "bg-slate-100",
                                            ].join(" ")}
                                        >
                                            <Icon className={selected ? "h-5 w-5 text-emerald-700" : "h-5 w-5 text-slate-600"} />
                                        </span>

                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{eventTypeLabels[t]}</p>
                                            <p className="text-xs text-slate-600">
                                                {t === "delivery" && "Entrega com endereço e contato."}
                                                {t === "service" && "Atendimento/ação com cliente."}
                                                {t === "task" && "Operação interna (inventário, validade...)."}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Título */}
                    <div className="mt-6 grid grid-cols-1 gap-2">
                        <label className="text-sm font-medium text-slate-800">
                            Título <span className="text-red-600">*</span>
                        </label>

                        <input
                            {...register("title")}
                            placeholder="Ex: Entrega pedido #1234"
                            className={[
                                "h-11 w-full rounded-xl border bg-white px-4 text-sm outline-none",
                                "focus:ring-2 focus:ring-emerald-500",
                                errors.title ? "border-red-400" : "border-slate-200",
                            ].join(" ")}
                        />
                        {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
                    </div>

                    {/* Data + Hora */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-800">
                                Data <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="date"
                                {...register("date")}
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            {errors.date && <p className="text-xs text-red-600">{errors.date.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-800">
                                Início <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="time"
                                {...register("startTime")}
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            {errors.startTime && <p className="text-xs text-red-600">{errors.startTime.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-800">
                                Término <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="time"
                                {...register("endTime")}
                                className={[
                                    "h-11 w-full rounded-xl border bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500",
                                    errors.endTime ? "border-red-400" : "border-slate-200",
                                ].join(" ")}
                            />
                            {errors.endTime && <p className="text-xs text-red-600">{errors.endTime.message}</p>}
                        </div>
                    </div>

                    {/* Loja + Responsável */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-800">
                                Loja <span className="text-red-600">*</span>
                            </label>
                            <select
                                {...register("storeId")}
                                className={[
                                    "h-11 w-full rounded-xl border bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500",
                                    errors.storeId ? "border-red-400" : "border-slate-200",
                                ].join(" ")}
                            >
                                <option value="">Selecione</option>
                                {stores.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                            {errors.storeId && <p className="text-xs text-red-600">{errors.storeId.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-800">
                                Responsável <span className="text-red-600">*</span>
                            </label>
                            <select
                                {...register("assigneeId")}
                                className={[
                                    "h-11 w-full rounded-xl border bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500",
                                    errors.assigneeId ? "border-red-400" : "border-slate-200",
                                ].join(" ")}
                            >
                                <option value="">Selecione</option>
                                {assignees.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.name}
                                    </option>
                                ))}
                            </select>
                            {errors.assigneeId && <p className="text-xs text-red-600">{errors.assigneeId.message}</p>}
                        </div>
                    </div>

                    {/* Prioridade */}
                    <div className="mt-6 space-y-2">
                        <label className="text-sm font-medium text-slate-800">Prioridade</label>
                        <div className="flex flex-wrap gap-2">
                            {(Object.keys(priorityLabels) as AgendaPriority[]).map((p) => {
                                const selected = priority === p;
                                const base =
                                    "h-9 rounded-xl border px-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-emerald-500";
                                const selectedCls =
                                    p === "high"
                                        ? "bg-red-600 text-white border-red-600"
                                        : p === "medium"
                                            ? "bg-amber-500 text-white border-amber-500"
                                            : "bg-emerald-600 text-white border-emerald-600";
                                return (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setValue("priority", p, { shouldDirty: true })}
                                        className={[base, selected ? selectedCls : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"].join(" ")}
                                    >
                                        {priorityLabels[p]}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Cliente (condicional) */}
                    {showCustomer && (
                        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm font-semibold text-slate-900">Dados do cliente</p>

                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-800">
                                        Nome <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        {...register("customerName")}
                                        placeholder="Ex: Ana Paula"
                                        className={[
                                            "h-11 w-full rounded-xl border bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500",
                                            errors.customerName ? "border-red-400" : "border-slate-200",
                                        ].join(" ")}
                                    />
                                    {errors.customerName && <p className="text-xs text-red-600">{errors.customerName.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-800">Telefone</label>
                                    <input
                                        {...register("customerPhone")}
                                        placeholder="(11) 99999-9999"
                                        onChange={(e) => setValue("customerPhone", formatPhone(e.target.value), { shouldDirty: true })}
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                                        maxLength={15}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Endereço (condicional) */}
                    {showAddress && (
                        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm font-semibold text-slate-900">Endereço de entrega</p>

                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
                                <div className="sm:col-span-3 space-y-2">
                                    <label className="text-sm font-medium text-slate-800">
                                        Rua <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        {...register("street")}
                                        placeholder="Ex: Rua das Flores"
                                        className={[
                                            "h-11 w-full rounded-xl border bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500",
                                            errors.street ? "border-red-400" : "border-slate-200",
                                        ].join(" ")}
                                    />
                                    {errors.street && <p className="text-xs text-red-600">{errors.street.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-800">
                                        Nº <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        {...register("number")}
                                        placeholder="123"
                                        className={[
                                            "h-11 w-full rounded-xl border bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500",
                                            errors.number ? "border-red-400" : "border-slate-200",
                                        ].join(" ")}
                                    />
                                    {errors.number && <p className="text-xs text-red-600">{errors.number.message}</p>}
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-800">
                                        Cidade <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        {...register("city")}
                                        placeholder="São Paulo"
                                        className={[
                                            "h-11 w-full rounded-xl border bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500",
                                            errors.city ? "border-red-400" : "border-slate-200",
                                        ].join(" ")}
                                    />
                                    {errors.city && <p className="text-xs text-red-600">{errors.city.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-800">UF</label>
                                    <input
                                        {...register("state")}
                                        placeholder="SP"
                                        onChange={(e) => setValue("state", e.target.value.toUpperCase(), { shouldDirty: true })}
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                                        maxLength={2}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-800">CEP</label>
                                    <input
                                        {...register("zip")}
                                        placeholder="00000-000"
                                        onChange={(e) => setValue("zip", formatZip(e.target.value), { shouldDirty: true })}
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                                        maxLength={9}
                                    />
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-800">Bairro</label>
                                    <input
                                        {...register("neighborhood")}
                                        placeholder="Centro"
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-800">Complemento</label>
                                    <input
                                        {...register("complement")}
                                        placeholder="Apto, bloco..."
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tags */}
                    <div className="mt-6 space-y-2">
                        <label className="text-sm font-medium text-slate-800">Tags</label>

                        <div className="flex gap-2">
                            <input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                placeholder="Adicionar tag..."
                                className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addTag();
                                    }
                                }}
                            />

                            <button
                                type="button"
                                onClick={addTag}
                                className="h-11 w-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center justify-center"
                            >
                                <Plus className="h-4 w-4 text-slate-700" />
                            </button>
                        </div>

                        {!!tags?.length && (
                            <div className="flex flex-wrap gap-2 pt-2">
                                {tags.map((t) => (
                                    <button
                                        type="button"
                                        key={t}
                                        onClick={() => removeTag(t)}
                                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
                                        title="Remover tag"
                                    >
                                        {t}
                                        <span className="text-slate-400">×</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Observações */}
                    <div className="mt-6 space-y-2">
                        <label className="text-sm font-medium text-slate-800">Descrição / Observações</label>
                        <textarea
                            {...register("description")}
                            rows={3}
                            placeholder="Ex: deixar na portaria, levar RG, pedido grande..."
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
                    </div>

                    {/* Taxa (somente entrega) */}
                    {type === "delivery" && (
                        <div className="mt-6 space-y-2">
                            <label className="text-sm font-medium text-slate-800">Taxa de entrega (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                min={0}
                                {...register("deliveryFee")}
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            {errors.deliveryFee && <p className="text-xs text-red-600">{errors.deliveryFee.message}</p>}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end border-t border-slate-200 pt-4">
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="h-11 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
                            disabled={isSubmitting}
                        >
                            {isEditing ? "Salvar alterações" : "Criar agendamento"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AgendaEventModal;
