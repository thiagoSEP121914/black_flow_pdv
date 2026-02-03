import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/Input/Input";
import type { AllSettings, Role } from "@/features/settings/types/settings";
import type { CompanyTab } from "@/features/settings/types/ui";
import { maskCnpj, maskPhoneBR } from "@/features/settings/utils/masks";
import { Divider, LockHint, TabPill, ToggleRow } from "@/features/settings/components/SettingsUI";

type CompanySectionProps = {
  draft: AllSettings;
  setDraft: (v: AllSettings | null) => void;
  tab: CompanyTab;
  setTab: (t: CompanyTab) => void;
  isAdminOrManager: boolean;
  onEditStore: (id: string) => void;
};

export function CompanySection({
  draft,
  setDraft,
  tab,
  setTab,
  isAdminOrManager,
  onEditStore,
}: CompanySectionProps) {
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <TabPill
          active={tab === "dados"}
          onClick={() => setTab("dados")}
          label="Dados da Empresa"
        />
        <TabPill
          active={tab === "operacao"}
          onClick={() => setTab("operacao")}
          label="Lojas e Operação"
        />
        <TabPill
          active={tab === "caixa_pdv"}
          onClick={() => setTab("caixa_pdv")}
          label="Caixa/PDV"
        />
        <TabPill
          active={tab === "pagamentos"}
          onClick={() => setTab("pagamentos")}
          label="Pagamentos"
        />
        <TabPill
          active={tab === "estoque"}
          onClick={() => setTab("estoque")}
          label="Estoque"
        />
        <TabPill
          active={tab === "integracoes"}
          onClick={() => setTab("integracoes")}
          label="Integrações"
        />
      </div>

      {tab === "dados" && (
        <>
          <div className="grid grid-cols-2 gap-4 max-[980px]:grid-cols-1">
            <Input
              label="Nome"
              value={draft.company.name}
              onChange={(v) =>
                setDraft({ ...draft, company: { ...draft.company, name: v } })
              }
              placeholder="Nome da empresa"
              required
            />
            <Input
              label="CNPJ"
              value={draft.company.cnpj}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  company: { ...draft.company, cnpj: maskCnpj(v) },
                })
              }
              placeholder="00.000.000/0000-00"
              required
            />

            <Input
              label="Telefone"
              value={draft.company.phone}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  company: { ...draft.company, phone: maskPhoneBR(v) },
                })
              }
              placeholder="(11) 99999-9999"
            />
            <Input
              label="E-mail"
              type="email"
              value={draft.company.email}
              onChange={(v) =>
                setDraft({ ...draft, company: { ...draft.company, email: v } })
              }
              placeholder="contato@empresa.com"
            />
          </div>

          <div className="mt-4">
            <Input
              label="Endereço"
              value={draft.company.address}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  company: { ...draft.company, address: v },
                })
              }
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
                  <div className="text-sm font-extrabold text-gray-900">
                    {s.name}
                  </div>
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
                  <div className="text-sm font-extrabold text-gray-900">
                    {t.name}
                  </div>
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

      {tab === "caixa_pdv" && (
        <>
          <LockHint isAdminOrManager={isAdminOrManager} />
          <div className="grid gap-4">
            <ToggleRow
              title="Exigir motivo em sangria/suprimento/fechamento"
              desc="Reforça auditoria e governança no módulo Caixa."
              checked={draft.cashPdv.requireReasonOnCriticalOps}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  cashPdv: { ...draft.cashPdv, requireReasonOnCriticalOps: v },
                })
              }
              disabled={!isAdminOrManager}
            />

            <ToggleRow
              title="Permitir reabertura de caixa"
              desc="Habilita reabrir um turno após fechamento (recomendado apenas para Admin/Gerente)."
              checked={draft.cashPdv.allowReopenCash}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  cashPdv: { ...draft.cashPdv, allowReopenCash: v },
                })
              }
              disabled={!isAdminOrManager}
            />

            <ToggleRow
              title="Modo rápido (atalhos de teclado)"
              desc="Atalhos para acelerar operação no PDV."
              checked={draft.cashPdv.quickModeShortcuts}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  cashPdv: { ...draft.cashPdv, quickModeShortcuts: v },
                })
              }
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
                  payments: {
                    ...draft.payments,
                    enabled: { ...draft.payments.enabled, cash: v },
                  },
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
                  payments: {
                    ...draft.payments,
                    enabled: { ...draft.payments.enabled, pix: v },
                  },
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
                  payments: {
                    ...draft.payments,
                    enabled: { ...draft.payments.enabled, card: v },
                  },
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
                  payments: {
                    ...draft.payments,
                    enabled: { ...draft.payments.enabled, voucher: v },
                  },
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
                  onClick={() =>
                    setDraft({
                      ...draft,
                      payments: { ...draft.payments, changeRule: opt.k as any },
                    })
                  }
                  className={[
                    "p-3 rounded-lg border text-left transition-colors",
                    draft.payments.changeRule === opt.k
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-gray-200 bg-white hover:bg-gray-50",
                    !isAdminOrManager ? "opacity-50 cursor-not-allowed" : "",
                  ].join(" ")}
                >
                  <div className="text-sm font-extrabold text-gray-900">
                    {opt.t}
                  </div>
                  <div className="text-xs text-gray-500">
                    Define comportamento de troco no PDV.
                  </div>
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
              onChange={(v) =>
                setDraft({
                  ...draft,
                  stock: { ...draft.stock, blockSaleWithoutStock: v },
                })
              }
              disabled={!isAdminOrManager}
            />

            <Input
              label="Alerta de estoque mínimo (padrão)"
              type="number"
              value={String(draft.stock.minStockAlertDefault)}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  stock: {
                    ...draft.stock,
                    minStockAlertDefault: Math.max(0, Number(v || 0)),
                  },
                })
              }
              disabled={!isAdminOrManager}
            />

            <ToggleRow
              title="Ativar controle de validade"
              desc="Útil para farmácia e perecíveis."
              checked={draft.stock.expiryEnabled}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  stock: { ...draft.stock, expiryEnabled: v },
                })
              }
              disabled={!isAdminOrManager}
            />

            <ToggleRow
              title="Ativar controle por lote"
              desc="Recomendado quando há rastreabilidade."
              checked={draft.stock.lotEnabled}
              onChange={(v) =>
                setDraft({ ...draft, stock: { ...draft.stock, lotEnabled: v } })
              }
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
              <div className="text-sm font-extrabold text-gray-900">
                E-mail (Relatórios)
              </div>
              <div className="text-xs text-gray-500">
                Envio de relatórios e alertas para o e-mail cadastrado.
              </div>
              <div className="mt-3">
                <Button
                  variant="outlined"
                  size="sm"
                  disabled={!isAdminOrManager}
                >
                  Configurar
                </Button>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg bg-white">
              <div className="text-sm font-extrabold text-gray-900">
                API Keys (previsto)
              </div>
              <div className="text-xs text-gray-500">
                Gerar/revogar chaves para integrações futuras.
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="primary"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  size="sm"
                  disabled={!isAdminOrManager}
                >
                  Gerar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={!isAdminOrManager}
                >
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
