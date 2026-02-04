import { toast } from "react-toastify";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/Input/Input";
import type { AllSettings } from "@/features/settings/types/settings";
import { maskPhoneBR } from "@/features/settings/utils/masks";
import { Divider, LockHint } from "@/features/settings/components/SettingsUI";

type UserSectionProps = {
  draft: AllSettings;
  setDraft: (v: AllSettings | null) => void;
  isAdminOrManager: boolean;
};

export function UserSection({
  draft,
  setDraft,
  isAdminOrManager,
}: UserSectionProps) {
  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-2 gap-4 max-[980px]:grid-cols-1">
        <Input
          label="Nome"
          value={draft.user.name}
          onChange={(v) =>
            setDraft({ ...draft, user: { ...draft.user, name: v } })
          }
        />
        <Input
          label="E-mail"
          type="email"
          value={draft.user.email}
          onChange={(v) =>
            setDraft({ ...draft, user: { ...draft.user, email: v } })
          }
        />
        <Input
          label="Telefone"
          value={draft.user.phone}
          onChange={(v) =>
            setDraft({
              ...draft,
              user: { ...draft.user, phone: maskPhoneBR(v) },
            })
          }
        />
        <Input
          label="Cargo/Role"
          value={draft.user.role}
          onChange={() => {}}
          disabled
        />
      </div>

      <Divider label="Sessões e Dispositivos" />
      <div className="grid gap-2">
        {draft.sessions.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white"
          >
            <div>
              <div className="text-sm font-extrabold text-gray-900">
                {s.device}
              </div>
              <div className="text-xs text-gray-500">
                IP: {s.ipHint} • Última atividade:{" "}
                {new Date(s.lastActiveAt).toLocaleString("pt-BR")}
              </div>
            </div>
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full border ${
                s.current
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-gray-50 text-gray-600 border-gray-200"
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
          <div
            key={u.id}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white"
          >
            <div>
              <div className="text-sm font-extrabold text-gray-900">
                {u.name}
              </div>
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
            onClick={() =>
              toast.info("Mock: abrir modal de criação de usuário")
            }
          >
            Criar Usuário
          </Button>
        </div>
      </div>
    </div>
  );
}
