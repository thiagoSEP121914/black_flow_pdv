import type { AllSettings } from "@/features/settings/types/settings";
import { Divider, LockHint, ToggleRow } from "@/features/settings/components/SettingsUI";

type NotificationsSectionProps = {
  draft: AllSettings;
  setDraft: (v: AllSettings | null) => void;
  isAdminOrManager: boolean;
};

export function NotificationsSection({
  draft,
  setDraft,
  isAdminOrManager,
}: NotificationsSectionProps) {
  const n = draft.notifications;

  return (
    <div className="grid gap-4">
      <Divider label="Canais" />
      <div className="grid grid-cols-3 gap-3 max-[980px]:grid-cols-1">
        <ToggleRow
          title="In-app"
          desc="Notificações dentro do sistema."
          checked={n.channels.inApp}
          onChange={(v) =>
            setDraft({
              ...draft,
              notifications: { ...n, channels: { ...n.channels, inApp: v } },
            })
          }
        />
        <ToggleRow
          title="E-mail"
          desc="Enviar alertas para e-mail."
          checked={n.channels.email}
          onChange={(v) =>
            setDraft({
              ...draft,
              notifications: { ...n, channels: { ...n.channels, email: v } },
            })
          }
        />
        <ToggleRow
          title="WhatsApp"
          desc="Previsto via integração."
          checked={n.channels.whatsapp}
          onChange={(v) =>
            setDraft({
              ...draft,
              notifications: { ...n, channels: { ...n.channels, whatsapp: v } },
            })
          }
          disabled={!isAdminOrManager}
        />
      </div>

      <Divider label="Preferências" />
      <div className="grid gap-2">
        <ToggleRow
          title="Alertas de estoque baixo"
          desc="Notifica quando produto atingir mínimo."
          checked={n.toggles.stockLow}
          onChange={(v) =>
            setDraft({
              ...draft,
              notifications: { ...n, toggles: { ...n.toggles, stockLow: v } },
            })
          }
        />
        <ToggleRow
          title="Relatórios diários"
          desc="Resumo diário para Admin/Gerente."
          checked={n.toggles.dailyReports}
          onChange={(v) =>
            setDraft({
              ...draft,
              notifications: {
                ...n,
                toggles: { ...n.toggles, dailyReports: v },
              },
            })
          }
        />
        <ToggleRow
          title="Novas vendas"
          desc="Notifica quando houver vendas."
          checked={n.toggles.newSales}
          onChange={(v) =>
            setDraft({
              ...draft,
              notifications: { ...n, toggles: { ...n.toggles, newSales: v } },
            })
          }
        />
        <ToggleRow
          title="Atualizações do sistema"
          desc="Avisos sobre melhorias e manutenção."
          checked={n.toggles.systemUpdates}
          onChange={(v) =>
            setDraft({
              ...draft,
              notifications: {
                ...n,
                toggles: { ...n.toggles, systemUpdates: v },
              },
            })
          }
        />

        <LockHint isAdminOrManager={isAdminOrManager} />
        <ToggleRow
          title="Validade próxima"
          desc="Farmácia/perecíveis: alerta de vencimento."
          checked={n.toggles.nearExpiry}
          onChange={(v) =>
            setDraft({
              ...draft,
              notifications: { ...n, toggles: { ...n.toggles, nearExpiry: v } },
            })
          }
          disabled={!isAdminOrManager}
        />
        <ToggleRow
          title="Divergência de caixa no fechamento"
          desc="Avisar quando houver diferença no fechamento."
          checked={n.toggles.cashDiffOnClose}
          onChange={(v) =>
            setDraft({
              ...draft,
              notifications: {
                ...n,
                toggles: { ...n.toggles, cashDiffOnClose: v },
              },
            })
          }
          disabled={!isAdminOrManager}
        />
      </div>
    </div>
  );
}
