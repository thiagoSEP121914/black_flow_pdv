import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/Input/Input";
import type { AllSettings } from "@/features/settings/types/settings";
import { Divider, LockHint, ToggleRow } from "@/features/settings/components/SettingsUI";

type SecuritySectionProps = {
  draft: AllSettings;
  setDraft: (v: AllSettings | null) => void;
  isAdminOrManager: boolean;
};

export function SecuritySection({
  draft,
  setDraft,
  isAdminOrManager,
}: SecuritySectionProps) {
  const s = draft.security;

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const changePasswordMock = () => {
    if (!currentPass || !newPass || !confirmPass)
      return toast.error("Preencha todos os campos.");
    if (newPass !== confirmPass)
      return toast.error("Confirmação diferente da nova senha.");
    toast.success("Senha alterada (mock).");
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
  };

  return (
    <div className="grid gap-5">
      <Divider label="Alterar senha" />
      <div className="grid grid-cols-3 gap-4 max-[980px]:grid-cols-1">
        <Input
          label="Senha atual"
          type="password"
          value={currentPass}
          onChange={setCurrentPass}
        />
        <Input
          label="Nova senha"
          type="password"
          value={newPass}
          onChange={setNewPass}
        />
        <Input
          label="Confirmar nova"
          type="password"
          value={confirmPass}
          onChange={setConfirmPass}
        />
      </div>
      <div>
        <Button
          variant="primary"
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
          onClick={changePasswordMock}
        >
          Alterar senha
        </Button>
      </div>

      <Divider label="2FA" />
      <ToggleRow
        title="Autenticação em duas etapas"
        desc="Ative para melhorar a segurança da conta."
        checked={s.twoFactorEnabled}
        onChange={(v) =>
          setDraft({ ...draft, security: { ...s, twoFactorEnabled: v } })
        }
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
                passwordPolicy: {
                  ...s.passwordPolicy,
                  minLength: Math.max(6, Number(v || 8)),
                },
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
              security: {
                ...s,
                passwordPolicy: {
                  ...s.passwordPolicy,
                  requireUpperLowerNumber: v,
                },
              },
            })
          }
          disabled={!isAdminOrManager}
        />
      </div>

      <Divider label="Logs/Auditoria (Admin/Gerente)" />
      <LockHint isAdminOrManager={isAdminOrManager} />
      <div
        className={`border border-gray-200 rounded-lg overflow-hidden ${!isAdminOrManager ? "opacity-50" : ""}`}
      >
        <div className="bg-gray-50 px-3 py-2 text-xs font-extrabold text-gray-600">
          Últimos eventos
        </div>
        {draft.auditLogs.map((l) => (
          <div
            key={l.id}
            className="px-3 py-3 bg-white border-t border-gray-200"
          >
            <div className="text-sm font-extrabold text-gray-900">
              {l.action} •{" "}
              <span className="text-gray-500 font-bold">{l.module}</span>
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
