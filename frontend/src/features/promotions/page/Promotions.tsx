// src/features/promotions/page/Promotions.tsx
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

import PromotionsHeader from "../components/PromotionsHeader";
import PromotionsTabs, { type PromotionsTabKey } from "../components/PromotionsTabs";
import PromotionsKpiRow from "../components/PromotionsKpiRow";
import PromotionsTable from "../components/PromotionsTable";
import PromotionDrawer from "../components/PromotionDrawer";
import PromotionWizardModal from "../components/PromotionWizardModal";
import CouponTable from "../components/CouponTable";
import CouponModal from "../components/CouponModal";
import ManualDiscountPolicyPanel from "../components/ManualDiscountPolicyPanel";
import StackingRulesMatrix from "../components/StackingRulesMatrix";
import AuditLogTable from "../components/AuditLogTable";

import {
  COUPONS_MOCK,
  PROMOTIONS_MOCK,
  MANUAL_DISCOUNT_POLICY_MOCK,
  AUDIT_LOG_MOCK,
} from "../mock/promotionsMock";

import type {
  Promotion,
  PromotionFilters,
  PromotionStatus,
  PromotionType,
  Coupon,
} from "../types/promotions";

function makeId() {
  // randomUUID quando disponível; fallback sem dependências
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c: any = typeof crypto !== "undefined" ? crypto : null;
  return c?.randomUUID?.() ?? `p_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function Promotions() {
  const [tab, setTab] = useState<PromotionsTabKey>("overview");

  const [filters, setFilters] = useState<PromotionFilters>({
    search: "",
    status: "all",
    type: "all",
  });

  const [promotions, setPromotions] = useState<Promotion[]>(PROMOTIONS_MOCK);
  const [coupons, setCoupons] = useState<Coupon[]>(COUPONS_MOCK);

  // Drawer (detalhes)
  const [selected, setSelected] = useState<Promotion | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Wizard (criar/editar)
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);

  // Cupom modal
  const [couponModalOpen, setCouponModalOpen] = useState(false);

  const filteredPromotions = useMemo(() => {
    const q = filters.search.trim().toLowerCase();

    return promotions.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q) ||
        p.ruleSummary.toLowerCase().includes(q);

      const matchesStatus =
        filters.status === "all"
          ? true
          : p.status === (filters.status as PromotionStatus);

      const matchesType =
        filters.type === "all"
          ? true
          : p.type === (filters.type as PromotionType);

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [promotions, filters]);

  // ===== Ações principais =====
  const onViewPromotion = (p: Promotion) => {
    setSelected(p);
    setDrawerOpen(true);
  };

  const onNewPromotion = () => {
    setEditingPromotion(null);
    setWizardOpen(true);
  };

  const onEditPromotion = (p: Promotion) => {
    setEditingPromotion(p);
    setWizardOpen(true);
  };

  const onSavePromotion = (payload: Promotion) => {
    setPromotions((prev) => {
      const exists = prev.some((x) => x.id === payload.id);
      if (exists) return prev.map((x) => (x.id === payload.id ? payload : x));
      return [payload, ...prev];
    });

    toast.success(
      editingPromotion ? "Promoção atualizada com sucesso." : "Promoção criada com sucesso."
    );

    setWizardOpen(false);
    setEditingPromotion(null);
  };

  // versão por ID (usada no Drawer)
  const onEndPromotionById = (id: string) => {
    setPromotions((prev) => prev.map((p) => (p.id === id ? { ...p, status: "ended" } : p)));
    setDrawerOpen(false);
    setSelected(null);
  };

  const onDeletePromotionById = (id: string) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
    setDrawerOpen(false);
    setSelected(null);
  };

  // versão por Promotion (usada no menu “...” da tabela)
  const duplicatePromotion = (p: Promotion) => {
    const copy: Promotion = {
      ...p,
      id: makeId(),
      name: `${p.name} (Cópia)`,
      status: "draft",
    };

    setPromotions((prev) => [copy, ...prev]);
    toast.success(`Promoção duplicada: "${copy.name}" criada como rascunho.`);
  };

  const endPromotion = (p: Promotion) => {
    onEndPromotionById(p.id);
    toast.info(`Promoção encerrada: "${p.name}".`);
  };

  const openDeleteConfirm = (p: Promotion) => {
    const ok = window.confirm(
      `Tem certeza que deseja excluir "${p.name}"?\nEssa ação não pode ser desfeita.`
    );
    if (!ok) return;

    onDeletePromotionById(p.id);
    toast.error(`Promoção excluída: "${p.name}".`);
  };

  // ===== Conteúdo por Aba =====
  const content = (() => {
    if (tab === "overview") {
      return (
        <>
          <PromotionsKpiRow promotions={filteredPromotions} />

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">Promoções ativas</h3>
              <p className="text-sm text-slate-500 mt-1">
                Visão rápida do que está rodando agora
              </p>
            </div>

            <PromotionsTable
              promotions={filteredPromotions.filter((p) => p.status === "active")}
              onView={onViewPromotion}
              onEdit={onEditPromotion}
              onDuplicate={duplicatePromotion}
              onEnd={endPromotion}
              onDelete={openDeleteConfirm}
            />
          </div>
        </>
      );
    }

    if (tab === "promotions") {
      return (
        <>
          <PromotionsKpiRow promotions={filteredPromotions} />

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">Lista de promoções</h3>
              <p className="text-sm text-slate-500 mt-1">
                Gerencie regras automáticas aplicadas no PDV e no Catálogo
              </p>
            </div>

            <PromotionsTable
              promotions={filteredPromotions}
              onView={onViewPromotion}
              onEdit={onEditPromotion}
              onDuplicate={duplicatePromotion}
              onEnd={endPromotion}
              onDelete={openDeleteConfirm}
            />
          </div>
        </>
      );
    }

    if (tab === "coupons") {
      return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
          <CouponTable coupons={coupons} onNewCoupon={() => setCouponModalOpen(true)} />
        </div>
      );
    }

    if (tab === "manual") {
      return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
          <ManualDiscountPolicyPanel policy={MANUAL_DISCOUNT_POLICY_MOCK} />
        </div>
      );
    }

    if (tab === "stacking") {
      return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
          <StackingRulesMatrix />
        </div>
      );
    }

    return (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
        <AuditLogTable entries={AUDIT_LOG_MOCK} />
      </div>
    );
  })();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-[1400px] px-6 py-6 space-y-6">
        <PromotionsHeader
          filters={filters}
          onFiltersChange={setFilters}
          onNewPromotion={onNewPromotion}
        />

        <PromotionsTabs value={tab} onChange={setTab} />

        {content}
      </div>

      <PromotionDrawer
        open={drawerOpen}
        promotion={selected}
        onClose={() => {
          setDrawerOpen(false);
          setSelected(null);
        }}
        onEdit={onEditPromotion}
        onEnd={onEndPromotionById}
        onDelete={onDeletePromotionById}
      />

      <PromotionWizardModal
        open={wizardOpen}
        initial={editingPromotion}
        onClose={() => {
          setWizardOpen(false);
          setEditingPromotion(null);
        }}
        onSave={onSavePromotion}
      />

      <CouponModal
        open={couponModalOpen}
        onClose={() => setCouponModalOpen(false)}
        onCreate={(coupon) => {
          setCoupons((prev) => [coupon, ...prev]);
          setCouponModalOpen(false);
          toast.success(`Cupom criado: "${coupon.code}"`);
        }}
      />
    </div>
  );
}
