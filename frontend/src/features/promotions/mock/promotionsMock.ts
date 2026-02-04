// src/features/promotions/mock/promotionsMock.ts
import type { AuditLogEntry, Coupon, ManualDiscountPolicy, Promotion } from "../types/promotions";

export const PROMOTIONS_MOCK: Promotion[] = [
  {
    id: "p1",
    name: "Black Friday 2024",
    description: "Descontos especiais de Black Friday em toda a loja",
    type: "category_discount",
    status: "active",
    startsAt: "2026-02-01T00:00:00.000Z",
    endsAt: "2026-02-05T23:59:59.000Z",
    ruleSummary: "20% off",
    priority: 5,
    stackable: { coupons: true, manualDiscount: false, otherPromos: false },
  },
  {
    id: "p2",
    name: "Leve 3 Pague 2 - Refrigerantes",
    description: "Promoção especial em refrigerantes",
    type: "buy_x_pay_y",
    status: "active",
    startsAt: "2026-02-02T00:00:00.000Z",
    endsAt: undefined,
    ruleSummary: "Leve 3, Pague 2",
    priority: 3,
    stackable: { coupons: true, manualDiscount: true, otherPromos: false },
  },
  {
    id: "p3",
    name: "Combo Lanche",
    description: "Sanduíche + Refrigerante + Batata por preço fixo",
    type: "combo",
    status: "scheduled",
    startsAt: "2026-02-10T00:00:00.000Z",
    endsAt: "2026-02-20T23:59:59.000Z",
    ruleSummary: "Combo R$ 19,90",
    priority: 4,
    stackable: { coupons: false, manualDiscount: false, otherPromos: false },
  },
  {
    id: "p4",
    name: "Atacado Cerveja",
    description: "Desconto progressivo por compras em quantidade",
    type: "quantity_tier",
    status: "active",
    startsAt: "2026-01-20T00:00:00.000Z",
    endsAt: undefined,
    ruleSummary: "A partir de 6 un.",
    priority: 2,
    stackable: { coupons: true, manualDiscount: false, otherPromos: true },
  },
];

export const COUPONS_MOCK: Coupon[] = [
  {
    id: "c1",
    code: "PROMO10",
    type: "percent",
    value: 10,
    startsAt: "2026-02-03T00:00:00.000Z",
    endsAt: "2026-12-31T23:59:59.000Z",
    usageLimit: 100,
    usedCount: 45,
    status: "active",
  },
  {
    id: "c2",
    code: "BEMVINDO",
    type: "amount",
    value: 15,
    startsAt: "2026-02-03T00:00:00.000Z",
    endsAt: undefined,
    usageLimit: undefined,
    usedCount: 120,
    status: "active",
  },
];

export const MANUAL_DISCOUNT_POLICY_MOCK: ManualDiscountPolicy = {
  maxDiscountPerOrderPercent: 100,
  maxDiscountPerItemPercent: 100,
  roleLimits: [
    { role: "admin", maxPercent: 100, requireReasonAbovePercent: 0, requireApprovalAbovePercent: 101 },
    { role: "manager", maxPercent: 30, requireReasonAbovePercent: 10, requireApprovalAbovePercent: 31 },
    { role: "cashier", maxPercent: 10, requireReasonAbovePercent: 5, requireApprovalAbovePercent: 11 },
  ],
};

export const AUDIT_LOG_MOCK: AuditLogEntry[] = [
  {
    id: "l1",
    createdAt: "2026-02-03T13:30:00.000Z",
    action: "create",
    entityType: "promotion",
    userName: "João Silva",
    details: { name: "Combo Lanche" },
  },
  {
    id: "l2",
    createdAt: "2026-02-03T14:00:00.000Z",
    action: "activate",
    entityType: "promotion",
    userName: "João Silva",
    details: { name: "Black Friday 2024" },
  },
  {
    id: "l3",
    createdAt: "2026-02-03T14:22:00.000Z",
    action: "coupon_used",
    entityType: "coupon",
    userName: "Maria Santos",
    details: { code: "PROMO10", orderId: "ORD-123", discount: 12.5 },
  },
  {
    id: "l4",
    createdAt: "2026-02-03T15:45:00.000Z",
    action: "manual_discount",
    entityType: "manual_discount",
    userName: "Carlos Oliveira",
    details: { orderId: "ORD-124", percent: 5, reason: "Cliente fidelidade" },
  },
];
