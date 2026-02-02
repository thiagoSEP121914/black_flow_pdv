import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Banknote, ArrowDownRight, ArrowUpRight, XCircle, RefreshCcw } from "lucide-react";

import { Card } from "@/shared/components/Cards/Card";
import { Input } from "@/shared/components/Input/Input";
import { Button } from "@/shared/components/ui/Button";

import { cashierMock, type CashMovement, type CashSummary } from "@/features/cashier/mock/cashierMock";
import { formatBRL, formatHour, parseDigitsToCents } from "@/features/cashier/utils/money";

export function Cashier() {
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const [openingCents, setOpeningCents] = useState(0);

  const [summary, setSummary] = useState<CashSummary | null>(null);
  const [movements, setMovements] = useState<CashMovement[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // modais simples
  const [modal, setModal] = useState<null | "deposit" | "withdraw" | "close">(null);
  const [amountCents, setAmountCents] = useState(0);
  const [reason, setReason] = useState("");

  const title = useMemo(() => (isOpen ? "Caixa • Painel" : "Caixa • Abertura"), [isOpen]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const st = await cashierMock.getStatus();
      setIsOpen(st.isOpen);

      if (st.isOpen) {
        const [s, m] = await Promise.all([cashierMock.getSummary(), cashierMock.getMovements()]);
        setSummary(s);
        setMovements(m);
      } else {
        setSummary(null);
        setMovements([]);
      }
    } catch {
      toast.error("Falha ao carregar o módulo Caixa.");
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    if (!isOpen) return;
    setRefreshing(true);
    try {
      const [s, m] = await Promise.all([cashierMock.getSummary(), cashierMock.getMovements()]);
      setSummary(s);
      setMovements(m);
    } catch {
      toast.error("Falha ao atualizar.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const onOpenCash = async () => {
    if (openingCents <= 0) {
      toast.error("Informe um valor de abertura válido.");
      return;
    }
    try {
      await cashierMock.openCash(openingCents);
      toast.success("Caixa aberto.");
      await loadAll();
    } catch {
      toast.error("Não foi possível abrir o caixa.");
    }
  };

  const onDeposit = async () => {
    if (amountCents <= 0) return toast.error("Informe um valor válido.");
    await cashierMock.deposit(amountCents, reason || undefined);
    toast.success("Suprimento registrado.");
    setModal(null);
    setAmountCents(0);
    setReason("");
    await refresh();
  };

  const onWithdraw = async () => {
    if (amountCents <= 0) return toast.error("Informe um valor válido.");
    await cashierMock.withdraw(amountCents, reason || undefined);
    toast.success("Sangria registrada.");
    setModal(null);
    setAmountCents(0);
    setReason("");
    await refresh();
  };

  const onClose = async () => {
    await cashierMock.closeCash(reason || undefined);
    toast.success("Caixa fechado.");
    setModal(null);
    setAmountCents(0);
    setReason("");
    await loadAll();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-[1200px] mx-auto">
          <Card>
            <div className="p-5 text-gray-600 font-semibold">Carregando Caixa...</div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 p-6 min-h-[calc(100vh-72px)]">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <div className="text-xl font-extrabold text-gray-900">{title}</div>
            <div className="text-sm text-gray-500">NextFlow ERP • Módulo Caixa (mockado)</div>
          </div>

          {isOpen && (
            <Button
              variant="outlined"
              className="h-10 gap-2"
              onClick={refresh}
              disabled={refreshing}
            >
              <RefreshCcw size={16} />
              {refreshing ? "Atualizando..." : "Atualizar"}
            </Button>
          )}
        </div>

        {/* ABERTURA */}
        {!isOpen && (
          <div className="max-w-[520px] mx-auto mt-10">
            <Card
              title="Abertura de Caixa"
              icon={<Banknote className="w-4 h-4" />}
            >
              <div className="p-5">
                <div className="text-sm text-gray-500 mb-4">
                  Informe o valor inicial para iniciar o turno do caixa.
                </div>

                <Input
                  label="Valor de Abertura (R$)"
                  value={formatBRL(openingCents)}
                  onChange={(raw) => setOpeningCents(parseDigitsToCents(raw))}
                  placeholder="R$ 0,00"
                />

                <div className="mt-4">
                  <Button
                    variant="primary"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={onOpenCash}
                    disabled={openingCents <= 0}
                  >
                    Abrir Caixa
                  </Button>
                </div>

                <div className="text-xs text-gray-500 mt-3">
                  Dica: pressione <b>Enter</b> após digitar o valor.
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* PAINEL */}
        {isOpen && summary && (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-4 gap-3 mb-4 max-[980px]:grid-cols-2">
              <Kpi label="Aberto às" value={formatHour(summary.openedAt)} />
              <Kpi label="Abertura" value={formatBRL(summary.openingAmountCents)} />
              <Kpi label="Vendas" value={formatBRL(summary.salesTotalCents)} />
              <Kpi label="Saldo Atual" value={formatBRL(summary.currentBalanceCents)} highlight />
            </div>

            {/* Corpo */}
            <div className="grid grid-cols-[2fr_1fr] gap-4 max-[980px]:grid-cols-1">
              <Card
                title="Movimentações do Dia"
                actions={
                  <Button variant="outlined" size="sm" onClick={refresh} disabled={refreshing}>
                    {refreshing ? "Atualizando..." : "Atualizar"}
                  </Button>
                }
              >
                <div className="p-5">
                  {movements.length === 0 ? (
                    <div className="text-sm text-gray-500">
                      Nenhuma movimentação registrada hoje.
                    </div>
                  ) : (
                    <div className="max-h-[420px] overflow-auto rounded-lg border border-gray-200">
                      {movements.map((m) => (
                        <MovementRow key={m.id} m={m} />
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              <Card title="Ações Rápidas">
                <div className="p-5">
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outlined"
                      className="gap-2"
                      onClick={() => setModal("withdraw")}
                    >
                      <ArrowUpRight size={16} />
                      Sangria
                    </Button>

                    <Button
                      variant="outlined"
                      className="gap-2"
                      onClick={() => setModal("deposit")}
                    >
                      <ArrowDownRight size={16} />
                      Suprimento
                    </Button>
                  </div>

                  <Button
                    variant="destructive"
                    className="w-full mt-4 gap-2"
                    onClick={() => setModal("close")}
                  >
                    <XCircle size={18} />
                    Fechar Caixa
                  </Button>

                  <div className="text-xs text-gray-500 mt-3">
                    Auditoria: registre motivo em operações críticas.
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}

        {/* MODAL simples */}
        {modal && (
          <div className="fixed inset-0 bg-slate-900/55 grid place-items-center p-4 z-50">
            <div className="w-full max-w-[560px] bg-white rounded-2xl border border-gray-200 shadow-xl">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <div className="text-sm font-extrabold text-gray-900">
                  {modal === "deposit" && "Suprimento (Entrada)"}
                  {modal === "withdraw" && "Sangria (Saída)"}
                  {modal === "close" && "Fechar Caixa"}
                </div>
                <Button variant="outlined" size="sm" onClick={() => setModal(null)}>
                  ✕
                </Button>
              </div>

              <div className="p-4 grid gap-3">
                {modal !== "close" && (
                  <>
                    <Input
                      label="Valor (R$)"
                      value={formatBRL(amountCents)}
                      onChange={(raw) => setAmountCents(parseDigitsToCents(raw))}
                      placeholder="R$ 0,00"
                    />
                    <Input
                      label={modal === "withdraw" ? "Motivo (recomendado)" : "Motivo (opcional)"}
                      value={reason}
                      onChange={setReason}
                      placeholder="Ex.: Troco extra / Retirada para depósito"
                    />
                  </>
                )}

                {modal === "close" && (
                  <>
                    <div className="text-sm text-gray-600">
                      Resumo: <b>Abertura</b> {formatBRL(summary?.openingAmountCents ?? 0)} •{" "}
                      <b>Vendas</b> {formatBRL(summary?.salesTotalCents ?? 0)} •{" "}
                      <b>Suprimentos</b> {formatBRL(summary?.depositsTotalCents ?? 0)} •{" "}
                      <b>Sangrias</b> {formatBRL(summary?.withdrawalsTotalCents ?? 0)}
                    </div>
                    <Input
                      label="Justificativa (opcional)"
                      value={reason}
                      onChange={setReason}
                      placeholder="Ex.: Diferença por troco / erro de contagem"
                    />
                  </>
                )}
              </div>

              <div className="px-4 py-3 border-t border-gray-100 flex justify-end gap-2">
                <Button variant="outlined" onClick={() => setModal(null)}>
                  Cancelar
                </Button>

                {modal === "deposit" && (
                  <Button
                    variant="primary"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={onDeposit}
                    disabled={amountCents <= 0}
                  >
                    Confirmar
                  </Button>
                )}

                {modal === "withdraw" && (
                  <Button
                    variant="primary"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={onWithdraw}
                    disabled={amountCents <= 0}
                  >
                    Confirmar
                  </Button>
                )}

                {modal === "close" && (
                  <Button variant="destructive" onClick={onClose}>
                    Fechar Caixa
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Kpi({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={`bg-white border rounded-2xl p-4 shadow-sm ${
        highlight ? "border-emerald-200" : "border-gray-200"
      }`}
    >
      <div className="text-xs font-extrabold text-gray-500">{label}</div>
      <div className={`mt-1 text-lg font-black ${highlight ? "text-emerald-600" : "text-gray-900"}`}>
        {value}
      </div>
    </div>
  );
}

function MovementRow({ m }: { m: CashMovement }) {
  const isNeg = m.amountCents < 0;

  const badge =
    m.type === "WITHDRAW"
      ? { text: "SANGRIA", cls: "bg-red-50 text-red-700 border-red-200" }
      : m.type === "DEPOSIT"
      ? { text: "SUPRIMENTO", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" }
      : { text: "VENDA", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };

  return (
    <div className="grid grid-cols-[1fr_auto] gap-3 px-3 py-3 border-b border-gray-200 last:border-b-0 bg-white">
      <div>
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-black px-2 py-1 rounded-full border ${badge.cls}`}>
            {badge.text}
          </span>
          <div className="text-sm font-extrabold text-gray-900">{m.title}</div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {formatHour(m.createdAt)}
          {m.reason ? ` • ${m.reason}` : ""}
        </div>
      </div>

      <div className={`text-sm font-black text-right whitespace-nowrap ${isNeg ? "text-red-500" : "text-gray-900"}`}>
        {formatBRL(m.amountCents)}
      </div>
    </div>
  );
}
