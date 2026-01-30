import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "react-toastify";
import {
  Building2,
  User,
  Bell,
  Shield,
  Palette,
  Save,
  Search,
  Lock,
  Laptop,
  Moon,
  Sun,
} from "lucide-react";

import { Card } from "@/shared/components/Cards/Card";
import { Input } from "@/shared/components/Input/Input";
import { Button } from "@/shared/components/ui/Button";

import { settingsMock } from "@/features/settings/mock/settingsMock";
import type { AllSettings, Role } from "@/features/settings/types/settings";
import { maskCnpj, maskPhoneBR } from "@/features/settings/utils/masks";

type SectionKey = "company" | "user" | "notifications" | "security" | "appearance";
type CompanyTab = "dados" | "operacao" | "caixa_pdv" | "pagamentos" | "estoque" | "integracoes";

export function Setting() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [active, setActive] = useState<SectionKey>("company");
  const [search, setSearch] = useState("");

  const [companyTab, setCompanyTab] = useState<CompanyTab>("dados");
  const [draft, setDraft] = useState<AllSettings | null>(null);

  // ---------------- Modal edição de Loja (Editar) ----------------
  const [storeEditId, setStoreEditId] = useState<string | null>(null);

  const storeToEdit = useMemo(() => {
    if (!draft || !storeEditId) return null;
    return draft.stores.find((s) => s.id === storeEditId) ?? null;
  }, [draft, storeEditId]);

  const [storeForm, setStoreForm] = useState({
    name: "",
    address: "",
    active: false,
  });

  useEffect(() => {
    if (!storeToEdit) return;
    setStoreForm({
      name: storeToEdit.name,
      address: storeToEdit.address,
      active: storeToEdit.active,
    });
  }, [storeToEdit?.id]);

  const closeStoreModal = () => setStoreEditId(null);

  const saveStoreModal = () => {
    if (!draft || !storeEditId) return;

    const nextStores = draft.stores.map((s) =>
      s.id === storeEditId ? { ...s, ...storeForm } : s
    );

    setDraft({ ...draft, stores: nextStores });
    toast.success("Loja atualizada (mock).");
    closeStoreModal();
  };

  // fechar no ESC (melhora UX e evita ficar preso)
  useEffect(() => {
    if (!storeEditId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeStoreModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [storeEditId]);

  // ---------------- Load mock ----------------
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await settingsMock.getAll();
        setDraft(data);
      } catch {
        toast.error("Falha ao carregar Configurações.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const role = draft?.user.role ?? ("Caixa" as Role);
  const isAdminOrManager = role === "Admin" || role === "Gerente";

  const menu = useMemo(
    () => [
      { key: "company" as const, label: "Empresa", icon: <Building2 className="w-4 h-4" /> },
      { key: "user" as const, label: "Usuário", icon: <User className="w-4 h-4" /> },
      { key: "notifications" as const, label: "Notificações", icon: <Bell className="w-4 h-4" /> },
      { key: "security" as const, label: "Segurança", icon: <Shield className="w-4 h-4" /> },
      { key: "appearance" as const, label: "Aparência", icon: <Palette className="w-4 h-4" /> },
    ],
    []
  );

  const filteredMenu = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return menu;
    return menu.filter((m) => m.label.toLowerCase().includes(q));
  }, [menu, search]);

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      await settingsMock.saveAll(draft);
      toast.success("Alterações salvas com sucesso.");
    } catch {
      toast.error("Não foi possível salvar as alterações.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !draft) {
    return (
      <div className="p-6">
        <div className="max-w-[1200px] mx-auto">
          <Card>
            <div className="p-5 text-gray-600 font-semibold">Carregando Configurações...</div>
          </Card>
        </div>
      </div>
    );
  }

  return (
  <div className="bg-slate-50 p-6 min-h-[calc(100vh-72px)]">
    <div className="max-w-[1200px] mx-auto">
      {/* ✅ HEADER REMOVIDO: mantém apenas o Topbar global */}

      {/* LAYOUT: sidebar interna + card conteúdo */}
      <div className="grid grid-cols-[260px_1fr] gap-4 max-[980px]:grid-cols-1">
        {/* SIDEBAR (coluna esquerda do F-pattern) */}
        <Card title="Menu" icon={<Laptop className="w-4 h-4" />}>
          <div className="p-3">
            {filteredMenu.length === 0 ? (
              <div className="text-sm text-gray-500 p-2">Nenhum item encontrado.</div>
            ) : (
              <div className="flex flex-col gap-1">
                {filteredMenu.map((item) => (
                  <MenuItem
                    key={item.key}
                    active={active === item.key}
                    label={item.label}
                    icon={item.icon}
                    onClick={() => setActive(item.key)}
                  />
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* CONTEÚDO (área principal) */}
        <Card
          title={sectionTitle(active)}
          actions={
            <Button
              variant="primary"
              className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={save}
              disabled={saving}
            >
              <Save className="w-4 h-4" />
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          }
        >
          <div className="p-5">
            {/* COMPANY */}
            {active === "company" && (
              <CompanySection
                draft={draft}
                setDraft={setDraft}
                tab={companyTab}
                setTab={setCompanyTab}
                isAdminOrManager={isAdminOrManager}
                onEditStore={(id) => setStoreEditId(id)} // ✅ botão Editar abre modal
              />
            )}

            {/* USER */}
            {active === "user" && (
              <UserSection draft={draft} setDraft={setDraft} isAdminOrManager={isAdminOrManager} />
            )}

            {/* NOTIFICATIONS */}
            {active === "notifications" && (
              <NotificationsSection draft={draft} setDraft={setDraft} isAdminOrManager={isAdminOrManager} />
            )}

            {/* SECURITY */}
            {active === "security" && (
              <SecuritySection draft={draft} setDraft={setDraft} isAdminOrManager={isAdminOrManager} />
            )}

            {/* APPEARANCE */}
            {active === "appearance" && <AppearanceSection draft={draft} setDraft={setDraft} />}
          </div>
        </Card>
      </div>
    </div>

    {/* ✅ MODAL: Editar Loja */}
    {storeEditId && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* overlay */}
        <button
          type="button"
          className="absolute inset-0 bg-black/40"
          onClick={closeStoreModal}
          aria-label="Fechar modal"
        />

        {/* painel */}
        <div className="relative w-full max-w-xl bg-white border border-gray-200 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <div className="text-sm font-extrabold text-gray-900">Editar Loja</div>
              <div className="text-xs text-gray-500">Ajuste nome, endereço e status.</div>
            </div>
            <Button variant="outlined" size="sm" onClick={closeStoreModal}>
              Fechar
            </Button>
          </div>

          <div className="p-5 grid gap-4">
            <Input
              label="Nome"
              value={storeForm.name}
              onChange={(v) => setStoreForm((p) => ({ ...p, name: v }))}
              placeholder="Nome da loja"
            />
            <Input
              label="Endereço"
              value={storeForm.address}
              onChange={(v) => setStoreForm((p) => ({ ...p, address: v }))}
              placeholder="Endereço completo"
            />

            <div className="flex items-start justify-between gap-4 p-4 rounded-lg border border-gray-200 bg-white">
              <div>
                <div className="text-sm font-extrabold text-gray-900">Loja ativa</div>
                <div className="text-xs text-gray-500 mt-1">
                  Se desativar, a loja fica como inativa no sistema.
                </div>
              </div>

              {/* ✅ Toggle mais aparente + vai esquerda/direita certinho */}
              <Switch
                checked={storeForm.active}
                onChange={(v) => setStoreForm((p) => ({ ...p, active: v }))}
              />
            </div>
          </div>

          <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-2">
            <Button variant="outlined" onClick={closeStoreModal}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={saveStoreModal}
            >
              Salvar
            </Button>
          </div>
        </div>
      </div>
    )}
    {/* ✅ FIM MODAL */}
  </div>
);
}

/* ---------------- UI helpers ---------------- */

function sectionTitle(key: SectionKey) {
  switch (key) {
    case "company":
      return "Empresa";
    case "user":
      return "Usuário";
    case "notifications":
      return "Notificações";
    case "security":
      return "Segurança";
    case "appearance":
      return "Aparência";
  }
}

function MenuItem({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-left",
        active
          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
          : "bg-white border-transparent hover:border-gray-200 hover:bg-gray-50 text-gray-800",
      ].join(" ")}
    >
      <span className={active ? "text-emerald-700" : "text-gray-500"}>{icon}</span>
      <span className="text-sm font-bold">{label}</span>
    </button>
  );
}

function Divider({ label }: { label?: string }) {
  return (
    <div className="my-5">
      {label && <div className="text-xs font-extrabold text-gray-500 mb-2">{label}</div>}
      <div className="h-px bg-gray-200" />
    </div>
  );
}

/**
 * ✅ Switch refeito:
 * - OFF bem visível (bg + borda)
 * - ON destacado
 * - bolinha vai 0% esquerda e 100% direita (translate-x-5)
 * - overflow-hidden evita “vazamento”
 * - focus ring (acessibilidade)
 */
function Switch({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled ? true : undefined}
      onClick={() => !disabled && onChange(!checked)}
      className={[
        "relative w-11 h-6 rounded-full border transition-colors overflow-hidden",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        checked ? "bg-emerald-500 border-emerald-500" : "bg-slate-200 border-slate-400",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow",
          "ring-1 ring-black/5 transition-transform",
          checked ? "translate-x-5" : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
}

function LockHint({ isAdminOrManager }: { isAdminOrManager: boolean }) {
  if (isAdminOrManager) return null;
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-3">
      <Lock className="w-4 h-4" />
      Somente <b>Admin/Gerente</b> pode alterar esta configuração.
    </div>
  );
}

/* ---------------- Sections ---------------- */

function CompanySection({
  draft,
  setDraft,
  tab,
  setTab,
  isAdminOrManager,
  onEditStore,
}: {
  draft: AllSettings;
  setDraft: (v: AllSettings | null) => void;
  tab: CompanyTab;
  setTab: (t: CompanyTab) => void;
  isAdminOrManager: boolean;
  onEditStore: (id: string) => void; // ✅ callback novo
}) {
  return (
    <div>
      {/* Tabs internas (sem complicar menu principal) */}
      <div className="flex flex-wrap gap-2 mb-4">
        <TabPill active={tab === "dados"} onClick={() => setTab("dados")} label="Dados da Empresa" />
        <TabPill active={tab === "operacao"} onClick={() => setTab("operacao")} label="Lojas e Operação" />
        <TabPill active={tab === "caixa_pdv"} onClick={() => setTab("caixa_pdv")} label="Caixa/PDV" />
        <TabPill active={tab === "pagamentos"} onClick={() => setTab("pagamentos")} label="Pagamentos" />
        <TabPill active={tab === "estoque"} onClick={() => setTab("estoque")} label="Estoque" />
        <TabPill active={tab === "integracoes"} onClick={() => setTab("integracoes")} label="Integrações" />
      </div>

      {tab === "dados" && (
        <>
          <div className="grid grid-cols-2 gap-4 max-[980px]:grid-cols-1">
            <Input
              label="Nome"
              value={draft.company.name}
              onChange={(v) => setDraft({ ...draft, company: { ...draft.company, name: v } })}
              placeholder="Nome da empresa"
              required
            />
            <Input
              label="CNPJ"
              value={draft.company.cnpj}
              onChange={(v) => setDraft({ ...draft, company: { ...draft.company, cnpj: maskCnpj(v) } })}
              placeholder="00.000.000/0000-00"
              required
            />

            <Input
              label="Telefone"
              value={draft.company.phone}
              onChange={(v) => setDraft({ ...draft, company: { ...draft.company, phone: maskPhoneBR(v) } })}
              placeholder="(11) 99999-9999"
            />
            <Input
              label="E-mail"
              type="email"
              value={draft.company.email}
              onChange={(v) => setDraft({ ...draft, company: { ...draft.company, email: v } })}
              placeholder="contato@empresa.com"
            />
          </div>

          <div className="mt-4">
            <Input
              label="Endereço"
              value={draft.company.address}
              onChange={(v) => setDraft({ ...draft, company: { ...draft.company, address: v } })}
              placeholder="Rua, número, bairro, cidade/UF"
            />
          </div>
        </>
      )}

      {tab === "operacao" && (
        <>
          <LockHint isAdminOrManager={isAdminOrManager} />
          <Divider label="Lojas" />

          <div className="grid gap-2">
            {draft.stores.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white"
              >
                <div>
                  <div className="text-sm font-extrabold text-gray-900">{s.name}</div>
                  <div className="text-xs text-gray-500">{s.address}</div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full border ${
                      s.active
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                  >
                    {s.active ? "Ativa" : "Inativa"}
                  </span>

                  {/* ✅ Botão Editar agora abre o popup */}
                  <Button
                    variant="outlined"
                    size="sm"
                    disabled={!isAdminOrManager}
                    onClick={() => onEditStore(s.id)}
                  >
                    Editar
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Divider label="Terminais/PDVs" />
          <div className="grid gap-2">
            {draft.terminals.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white"
              >
                <div>
                  <div className="text-sm font-extrabold text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-500">Loja: {t.storeId}</div>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full border ${
                    t.status === "online"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : t.status === "offline"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* (restante igual ao seu) */}
      {tab === "caixa_pdv" && (
        <>
          <LockHint isAdminOrManager={isAdminOrManager} />
          <div className="grid gap-4">
            <ToggleRow
              title="Exigir motivo em sangria/suprimento/fechamento"
              desc="Reforça auditoria e governança no módulo Caixa."
              checked={draft.cashPdv.requireReasonOnCriticalOps}
              onChange={(v) =>
                setDraft({ ...draft, cashPdv: { ...draft.cashPdv, requireReasonOnCriticalOps: v } })
              }
              disabled={!isAdminOrManager}
            />

            <ToggleRow
              title="Permitir reabertura de caixa"
              desc="Habilita reabrir um turno após fechamento (recomendado apenas para Admin/Gerente)."
              checked={draft.cashPdv.allowReopenCash}
              onChange={(v) => setDraft({ ...draft, cashPdv: { ...draft.cashPdv, allowReopenCash: v } })}
              disabled={!isAdminOrManager}
            />

            <ToggleRow
              title="Modo rápido (atalhos de teclado)"
              desc="Atalhos para acelerar operação no PDV."
              checked={draft.cashPdv.quickModeShortcuts}
              onChange={(v) => setDraft({ ...draft, cashPdv: { ...draft.cashPdv, quickModeShortcuts: v } })}
              disabled={!isAdminOrManager}
            />

            <Divider label="Limite de desconto por perfil (%)" />
            <div className="grid grid-cols-3 gap-4 max-[980px]:grid-cols-1">
              {(["Admin", "Gerente", "Caixa"] as Role[]).map((r) => (
                <Input
                  key={r}
                  label={r}
                  type="number"
                  value={String(draft.cashPdv.discountLimitByRole[r] ?? 0)}
                  onChange={(v) =>
                    setDraft({
                      ...draft,
                      cashPdv: {
                        ...draft.cashPdv,
                        discountLimitByRole: {
                          ...draft.cashPdv.discountLimitByRole,
                          [r]: Math.max(0, Math.min(100, Number(v || 0))),
                        },
                      },
                    })
                  }
                  disabled={!isAdminOrManager}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {tab === "pagamentos" && (
        <>
          <LockHint isAdminOrManager={isAdminOrManager} />
          <div className="grid gap-4">
            <ToggleRow
              title="Dinheiro"
              desc="Habilitar pagamento em dinheiro."
              checked={draft.payments.enabled.cash}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  payments: { ...draft.payments, enabled: { ...draft.payments.enabled, cash: v } },
                })
              }
              disabled={!isAdminOrManager}
            />
            <ToggleRow
              title="Pix"
              desc="Habilitar Pix no PDV."
              checked={draft.payments.enabled.pix}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  payments: { ...draft.payments, enabled: { ...draft.payments.enabled, pix: v } },
                })
              }
              disabled={!isAdminOrManager}
            />
            <ToggleRow
              title="Cartão"
              desc="Habilitar débito/crédito."
              checked={draft.payments.enabled.card}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  payments: { ...draft.payments, enabled: { ...draft.payments.enabled, card: v } },
                })
              }
              disabled={!isAdminOrManager}
            />
            <ToggleRow
              title="Voucher"
              desc="Habilitar voucher/vale."
              checked={draft.payments.enabled.voucher}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  payments: { ...draft.payments, enabled: { ...draft.payments.enabled, voucher: v } },
                })
              }
              disabled={!isAdminOrManager}
            />

            <Divider label="Regra de troco" />
            <div className="grid grid-cols-3 gap-2 max-[980px]:grid-cols-1">
              {[
                { k: "always_allow", t: "Permitir sempre" },
                { k: "only_cash", t: "Apenas dinheiro" },
                { k: "never", t: "Nunca" },
              ].map((opt) => (
                <button
                  key={opt.k}
                  disabled={!isAdminOrManager}
                  onClick={() => setDraft({ ...draft, payments: { ...draft.payments, changeRule: opt.k as any } })}
                  className={[
                    "p-3 rounded-lg border text-left transition-colors",
                    draft.payments.changeRule === opt.k
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-gray-200 bg-white hover:bg-gray-50",
                    !isAdminOrManager ? "opacity-50 cursor-not-allowed" : "",
                  ].join(" ")}
                >
                  <div className="text-sm font-extrabold text-gray-900">{opt.t}</div>
                  <div className="text-xs text-gray-500">Define comportamento de troco no PDV.</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === "estoque" && (
        <>
          <LockHint isAdminOrManager={isAdminOrManager} />
          <div className="grid gap-4">
            <ToggleRow
              title="Bloquear venda sem estoque"
              desc="Evita finalizar venda se o estoque estiver zerado."
              checked={draft.stock.blockSaleWithoutStock}
              onChange={(v) => setDraft({ ...draft, stock: { ...draft.stock, blockSaleWithoutStock: v } })}
              disabled={!isAdminOrManager}
            />

            <Input
              label="Alerta de estoque mínimo (padrão)"
              type="number"
              value={String(draft.stock.minStockAlertDefault)}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  stock: { ...draft.stock, minStockAlertDefault: Math.max(0, Number(v || 0)) },
                })
              }
              disabled={!isAdminOrManager}
            />

            <ToggleRow
              title="Ativar controle de validade"
              desc="Útil para farmácia e perecíveis."
              checked={draft.stock.expiryEnabled}
              onChange={(v) => setDraft({ ...draft, stock: { ...draft.stock, expiryEnabled: v } })}
              disabled={!isAdminOrManager}
            />

            <ToggleRow
              title="Ativar controle por lote"
              desc="Recomendado quando há rastreabilidade."
              checked={draft.stock.lotEnabled}
              onChange={(v) => setDraft({ ...draft, stock: { ...draft.stock, lotEnabled: v } })}
              disabled={!isAdminOrManager}
            />
          </div>
        </>
      )}

      {tab === "integracoes" && (
        <>
          <LockHint isAdminOrManager={isAdminOrManager} />
          <div className="grid gap-3">
            <div className="p-4 border border-gray-200 rounded-lg bg-white">
              <div className="text-sm font-extrabold text-gray-900">E-mail (Relatórios)</div>
              <div className="text-xs text-gray-500">Envio de relatórios e alertas para o e-mail cadastrado.</div>
              <div className="mt-3">
                <Button variant="outlined" size="sm" disabled={!isAdminOrManager}>
                  Configurar
                </Button>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg bg-white">
              <div className="text-sm font-extrabold text-gray-900">API Keys (previsto)</div>
              <div className="text-xs text-gray-500">Gerar/revogar chaves para integrações futuras.</div>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="primary"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  size="sm"
                  disabled={!isAdminOrManager}
                >
                  Gerar
                </Button>
                <Button variant="destructive" size="sm" disabled={!isAdminOrManager}>
                  Revogar
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function TabPill({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={[
        "px-3 py-2 rounded-full border text-sm font-extrabold transition-colors",
        active
          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
          : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function ToggleRow({
  title,
  desc,
  checked,
  onChange,
  disabled,
}: {
  title: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 p-4 rounded-lg border border-gray-200 bg-white">
      <div>
        <div className="text-sm font-extrabold text-gray-900">{title}</div>
        <div className="text-xs text-gray-500 mt-1">{desc}</div>
      </div>
      <Switch checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  );
}

/* ---------- As outras sections (UserSection, NotificationsSection, SecuritySection, AppearanceSection, ThemeCard) ---------- */
/* ✅ Mantive sua versão. Se você já tinha elas no arquivo, é só deixar como estão. */

function UserSection({
  draft,
  setDraft,
  isAdminOrManager,
}: {
  draft: AllSettings;
  setDraft: (v: AllSettings | null) => void;
  isAdminOrManager: boolean;
}) {
  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-2 gap-4 max-[980px]:grid-cols-1">
        <Input label="Nome" value={draft.user.name} onChange={(v) => setDraft({ ...draft, user: { ...draft.user, name: v } })} />
        <Input
          label="E-mail"
          type="email"
          value={draft.user.email}
          onChange={(v) => setDraft({ ...draft, user: { ...draft.user, email: v } })}
        />
        <Input label="Telefone" value={draft.user.phone} onChange={(v) => setDraft({ ...draft, user: { ...draft.user, phone: maskPhoneBR(v) } })} />
        <Input label="Cargo/Role" value={draft.user.role} onChange={() => {}} disabled />
      </div>

      <Divider label="Sessões e Dispositivos" />
      <div className="grid gap-2">
        {draft.sessions.map((s) => (
          <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white">
            <div>
              <div className="text-sm font-extrabold text-gray-900">{s.device}</div>
              <div className="text-xs text-gray-500">
                IP: {s.ipHint} • Última atividade: {new Date(s.lastActiveAt).toLocaleString("pt-BR")}
              </div>
            </div>
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full border ${
                s.current ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-50 text-gray-600 border-gray-200"
              }`}
            >
              {s.current ? "Atual" : "Ativa"}
            </span>
          </div>
        ))}
      </div>

      <Divider label="Equipe e Papéis (Admin/Gerente)" />
      <LockHint isAdminOrManager={isAdminOrManager} />
      <div className="grid gap-2">
        {draft.teamUsers.map((u) => (
          <div key={u.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white">
            <div>
              <div className="text-sm font-extrabold text-gray-900">{u.name}</div>
              <div className="text-xs text-gray-500">{u.email}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                {u.role}
              </span>
              <Button variant="outlined" size="sm" disabled={!isAdminOrManager}>
                Editar
              </Button>
            </div>
          </div>
        ))}
        <div>
          <Button
            variant="primary"
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
            disabled={!isAdminOrManager}
            onClick={() => toast.info("Mock: abrir modal de criação de usuário")}
          >
            Criar Usuário
          </Button>
        </div>
      </div>
    </div>
  );
}

function NotificationsSection({
  draft,
  setDraft,
  isAdminOrManager,
}: {
  draft: AllSettings;
  setDraft: (v: AllSettings | null) => void;
  isAdminOrManager: boolean;
}) {
  const n = draft.notifications;

  return (
    <div className="grid gap-4">
      <Divider label="Canais" />
      <div className="grid grid-cols-3 gap-3 max-[980px]:grid-cols-1">
        <ToggleRow
          title="In-app"
          desc="Notificações dentro do sistema."
          checked={n.channels.inApp}
          onChange={(v) => setDraft({ ...draft, notifications: { ...n, channels: { ...n.channels, inApp: v } } })}
        />
        <ToggleRow
          title="E-mail"
          desc="Enviar alertas para e-mail."
          checked={n.channels.email}
          onChange={(v) => setDraft({ ...draft, notifications: { ...n, channels: { ...n.channels, email: v } } })}
        />
        <ToggleRow
          title="WhatsApp"
          desc="Previsto via integração."
          checked={n.channels.whatsapp}
          onChange={(v) => setDraft({ ...draft, notifications: { ...n, channels: { ...n.channels, whatsapp: v } } })}
          disabled={!isAdminOrManager}
        />
      </div>

      <Divider label="Preferências" />
      <div className="grid gap-2">
        <ToggleRow
          title="Alertas de estoque baixo"
          desc="Notifica quando produto atingir mínimo."
          checked={n.toggles.stockLow}
          onChange={(v) => setDraft({ ...draft, notifications: { ...n, toggles: { ...n.toggles, stockLow: v } } })}
        />
        <ToggleRow
          title="Relatórios diários"
          desc="Resumo diário para Admin/Gerente."
          checked={n.toggles.dailyReports}
          onChange={(v) =>
            setDraft({ ...draft, notifications: { ...n, toggles: { ...n.toggles, dailyReports: v } } })
          }
        />
        <ToggleRow
          title="Novas vendas"
          desc="Notifica quando houver vendas."
          checked={n.toggles.newSales}
          onChange={(v) => setDraft({ ...draft, notifications: { ...n, toggles: { ...n.toggles, newSales: v } } })}
        />
        <ToggleRow
          title="Atualizações do sistema"
          desc="Avisos sobre melhorias e manutenção."
          checked={n.toggles.systemUpdates}
          onChange={(v) =>
            setDraft({ ...draft, notifications: { ...n, toggles: { ...n.toggles, systemUpdates: v } } })
          }
        />

        <LockHint isAdminOrManager={isAdminOrManager} />
        <ToggleRow
          title="Validade próxima"
          desc="Farmácia/perecíveis: alerta de vencimento."
          checked={n.toggles.nearExpiry}
          onChange={(v) => setDraft({ ...draft, notifications: { ...n, toggles: { ...n.toggles, nearExpiry: v } } })}
          disabled={!isAdminOrManager}
        />
        <ToggleRow
          title="Divergência de caixa no fechamento"
          desc="Avisar quando houver diferença no fechamento."
          checked={n.toggles.cashDiffOnClose}
          onChange={(v) =>
            setDraft({ ...draft, notifications: { ...n, toggles: { ...n.toggles, cashDiffOnClose: v } } })
          }
          disabled={!isAdminOrManager}
        />
      </div>
    </div>
  );
}

function SecuritySection({
  draft,
  setDraft,
  isAdminOrManager,
}: {
  draft: AllSettings;
  setDraft: (v: AllSettings | null) => void;
  isAdminOrManager: boolean;
}) {
  const s = draft.security;

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const changePasswordMock = () => {
    if (!currentPass || !newPass || !confirmPass) return toast.error("Preencha todos os campos.");
    if (newPass !== confirmPass) return toast.error("Confirmação diferente da nova senha.");
    toast.success("Senha alterada (mock).");
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
  };

  return (
    <div className="grid gap-5">
      <Divider label="Alterar senha" />
      <div className="grid grid-cols-3 gap-4 max-[980px]:grid-cols-1">
        <Input label="Senha atual" type="password" value={currentPass} onChange={setCurrentPass} />
        <Input label="Nova senha" type="password" value={newPass} onChange={setNewPass} />
        <Input label="Confirmar nova" type="password" value={confirmPass} onChange={setConfirmPass} />
      </div>
      <div>
        <Button variant="primary" className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={changePasswordMock}>
          Alterar senha
        </Button>
      </div>

      <Divider label="2FA" />
      <ToggleRow
        title="Autenticação em duas etapas"
        desc="Ative para melhorar a segurança da conta."
        checked={s.twoFactorEnabled}
        onChange={(v) => setDraft({ ...draft, security: { ...s, twoFactorEnabled: v } })}
      />

      <Divider label="Políticas (Admin/Gerente)" />
      <LockHint isAdminOrManager={isAdminOrManager} />

      <div className="grid grid-cols-2 gap-4 max-[980px]:grid-cols-1">
        <Input
          label="Tamanho mínimo da senha"
          type="number"
          value={String(s.passwordPolicy.minLength)}
          onChange={(v) =>
            setDraft({
              ...draft,
              security: {
                ...s,
                passwordPolicy: { ...s.passwordPolicy, minLength: Math.max(6, Number(v || 8)) },
              },
            })
          }
          disabled={!isAdminOrManager}
        />

        <ToggleRow
          title="Exigir maiúscula/minúscula/número"
          desc="Política de complexidade (mock)."
          checked={s.passwordPolicy.requireUpperLowerNumber}
          onChange={(v) =>
            setDraft({
              ...draft,
              security: { ...s, passwordPolicy: { ...s.passwordPolicy, requireUpperLowerNumber: v } },
            })
          }
          disabled={!isAdminOrManager}
        />
      </div>

      <Divider label="Logs/Auditoria (Admin/Gerente)" />
      <LockHint isAdminOrManager={isAdminOrManager} />
      <div className={`border border-gray-200 rounded-lg overflow-hidden ${!isAdminOrManager ? "opacity-50" : ""}`}>
        <div className="bg-gray-50 px-3 py-2 text-xs font-extrabold text-gray-600">Últimos eventos</div>
        {draft.auditLogs.map((l) => (
          <div key={l.id} className="px-3 py-3 bg-white border-t border-gray-200">
            <div className="text-sm font-extrabold text-gray-900">
              {l.action} • <span className="text-gray-500 font-bold">{l.module}</span>
            </div>
            <div className="text-xs text-gray-500">
              {l.userName} • {new Date(l.createdAt).toLocaleString("pt-BR")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppearanceSection({
  draft,
  setDraft,
}: {
  draft: AllSettings;
  setDraft: (v: AllSettings | null) => void;
}) {
  const a = draft.appearance;

  return (
    <div className="grid gap-5">
      <Divider label="Tema" />
      <div className="grid grid-cols-2 gap-3 max-[980px]:grid-cols-1">
        <ThemeCard
          active={a.theme === "light"}
          title="Claro"
          icon={<Sun className="w-4 h-4" />}
          onClick={() => setDraft({ ...draft, appearance: { ...a, theme: "light" } })}
        />
        <ThemeCard
          active={a.theme === "dark"}
          title="Escuro"
          icon={<Moon className="w-4 h-4" />}
          onClick={() => setDraft({ ...draft, appearance: { ...a, theme: "dark" } })}
        />
      </div>

      <Divider label="Layout" />
      <ToggleRow
        title="Menu compacto"
        desc="Reduz largura do menu lateral para ganhar espaço."
        checked={a.compactMenu}
        onChange={(v) => setDraft({ ...draft, appearance: { ...a, compactMenu: v } })}
      />

      <Divider label="Densidade" />
      <div className="grid grid-cols-2 gap-3 max-[980px]:grid-cols-1">
        <button
          className={`p-4 rounded-lg border text-left ${
            a.density === "comfortable"
              ? "bg-emerald-50 border-emerald-200"
              : "bg-white border-gray-200 hover:bg-gray-50"
          }`}
          onClick={() => setDraft({ ...draft, appearance: { ...a, density: "comfortable" } })}
        >
          <div className="text-sm font-extrabold text-gray-900">Confortável</div>
          <div className="text-xs text-gray-500">Mais espaçamento em listas e cards.</div>
        </button>

        <button
          className={`p-4 rounded-lg border text-left ${
            a.density === "compact" ? "bg-emerald-50 border-emerald-200" : "bg-white border-gray-200 hover:bg-gray-50"
          }`}
          onClick={() => setDraft({ ...draft, appearance: { ...a, density: "compact" } })}
        >
          <div className="text-sm font-extrabold text-gray-900">Compacta</div>
          <div className="text-xs text-gray-500">Ideal para listas grandes (ERP).</div>
        </button>
      </div>
    </div>
  );
}

function ThemeCard({
  active,
  title,
  icon,
  onClick,
}: {
  active: boolean;
  title: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "p-4 rounded-lg border text-left transition-colors flex items-start gap-3",
        active ? "bg-emerald-50 border-emerald-200" : "bg-white border-gray-200 hover:bg-gray-50",
      ].join(" ")}
    >
      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
        {icon}
      </div>
      <div>
        <div className="text-sm font-extrabold text-gray-900">{title}</div>
        <div className="text-xs text-gray-500">Mantém visual limpo e legível.</div>
      </div>
    </button>
  );
}
