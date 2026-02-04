export type AgendaEventType = "delivery" | "service" | "task";
export type AgendaEventStatus = "scheduled" | "in_progress" | "completed" | "cancelled";
export type AgendaPriority = "low" | "medium" | "high";

export interface Address {
  id: string;
  street: string;
  number: string;
  neighborhood?: string;
  city: string;
  state: string;
  zip: string;
  complement?: string;
}
export type AgendaEventFormData = {
  type: AgendaEventType;
  title: string;
  description?: string;

  date: Date;          // ✅ Date
  startTime: string;   // "HH:mm"
  endTime: string;     // "HH:mm"

  priority: AgendaPriority;
  tags: string[];

  storeId: string;
  assigneeId: string;

  customerName?: string;
  customerPhone?: string;

  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip?: string;
  complement?: string;

  orderId?: string;
  deliveryFee?: number;
};

export interface AgendaEvent {
  id: string;
  type: AgendaEventType;
  title: string;
  description?: string;

  startAt: Date;
  endAt: Date;

  status: AgendaEventStatus;
  priority: AgendaPriority;
  tags: string[];

  storeId: string;
  assigneeId: string;

  customerName?: string;
  customerPhone?: string;
  address?: Address;

  orderId?: string;
  deliveryFee?: number;

  createdAt: Date;
  createdBy: string;

  updatedAt?: Date;
  cancelReason?: string;
}

export interface AgendaFilters {
  storeId?: string;
  assigneeId?: string;
  type?: AgendaEventType;
  status?: AgendaEventStatus;
  priority?: AgendaPriority;
}

export const eventTypeLabels: Record<AgendaEventType, string> = {
  delivery: "Entrega",
  service: "Serviço",
  task: "Tarefa",
};

export const eventStatusLabels: Record<AgendaEventStatus, string> = {
  scheduled: "Agendado",
  in_progress: "Em andamento",
  completed: "Concluído",
  cancelled: "Cancelado",
};

export const priorityLabels: Record<AgendaPriority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

