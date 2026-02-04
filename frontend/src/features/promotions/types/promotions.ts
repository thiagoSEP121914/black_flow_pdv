// src/features/promotions/types/promotions.ts
export type PromotionStatus = "draft" | "scheduled" | "active" | "ended";

export type PromotionType =
  | "product_discount"
  | "category_discount"
  | "buy_x_pay_y"
  | "combo"
  | "quantity_tier"
  | "progressive"
  | "happy_hour";

export interface Promotion {
  id: string;
  name: string;
  description?: string;
  type: PromotionType;
  status: PromotionStatus;
  startsAt: string; // ISO
  endsAt?: string; // ISO
  ruleSummary: string;
  priority: number; // 1..5
  stackable: {
    coupons: boolean;
    manualDiscount: boolean;
    otherPromos: boolean;
  };
}

export interface PromotionFilters {
  search: string;
  status: PromotionStatus | "all";
  type: PromotionType | "all";
}

export type CouponType = "percent" | "amount";

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number; // percent or amount
  startsAt: string; // ISO
  endsAt?: string; // ISO
  minOrderAmount?: number;
  usageLimit?: number;
  usedCount: number;
  status: "active" | "inactive" | "expired";
}

export interface ManualDiscountPolicy {
  roleLimits: Array<{
    role: "admin" | "manager" | "cashier";
    maxPercent: number;
    requireReasonAbovePercent: number;
    requireApprovalAbovePercent: number;
  }>;
  maxDiscountPerOrderPercent: number;
  maxDiscountPerItemPercent: number;
}

export interface AuditLogEntry {
  id: string;
  createdAt: string; // ISO
  action: "create" | "activate" | "end" | "delete" | "coupon_used" | "manual_discount";
  entityType: "promotion" | "coupon" | "manual_discount";
  userName: string;
  details: Record<string, any>;
}
