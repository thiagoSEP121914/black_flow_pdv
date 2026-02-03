import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

// evita "" virar 0, e mantém number quando vier preenchido
const optionalNumber = z.preprocess((v) => {
  if (v === "" || v === null || v === undefined) return undefined;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isNaN(n) ? undefined : n;
}, z.number().min(0).optional());

export const agendaEventFormSchema = z
  .object({
    type: z.enum(["delivery", "service", "task"]),
    title: z.string().min(1, "Título é obrigatório").max(80, "Máx. 80 caracteres"),
    description: z.string().max(500, "Máx. 500 caracteres").optional(),

    // inputs HTML retornam string (yyyy-mm-dd)
    date: z.string().min(1, "Data é obrigatória"),
    startTime: z.string().regex(timeRegex, "Horário inválido"),
    endTime: z.string().regex(timeRegex, "Horário inválido"),

    priority: z.enum(["low", "medium", "high"]).default("medium"),
    tags: z.array(z.string().min(1)).default([]),

    storeId: z.string().min(1, "Selecione uma loja"),
    assigneeId: z.string().min(1, "Selecione um responsável"),

    customerName: z.string().optional(),
    customerPhone: z.string().optional(),

    street: z.string().optional(),
    number: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    complement: z.string().optional(),

    orderId: z.string().optional(),
    deliveryFee: optionalNumber,
  })
  .superRefine((data, ctx) => {
    // end > start
    if (toMinutes(data.endTime) <= toMinutes(data.startTime)) {
      ctx.addIssue({
        code: "custom",
        message: "Término deve ser depois do início",
        path: ["endTime"],
      });
    }

    // delivery/service => customerName obrigatório
    if ((data.type === "delivery" || data.type === "service") && !data.customerName?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Nome do cliente é obrigatório",
        path: ["customerName"],
      });
    }

    // delivery => endereço mínimo obrigatório
    if (data.type === "delivery") {
      if (!data.street?.trim()) ctx.addIssue({ code: "custom", message: "Rua é obrigatória", path: ["street"] });
      if (!data.number?.trim()) ctx.addIssue({ code: "custom", message: "Número é obrigatório", path: ["number"] });
      if (!data.city?.trim()) ctx.addIssue({ code: "custom", message: "Cidade é obrigatória", path: ["city"] });
    }
  });

// ✅ output (após validação/preprocess)


// ✅ input (o que o form realmente manipula)
export type AgendaEventFormInput = z.input<typeof agendaEventFormSchema>;

// ✅ se você quiser o nome “FormData”
export type AgendaEventFormData = AgendaEventFormValues;

export type AgendaEventFormValues = z.infer<typeof agendaEventFormSchema>;

