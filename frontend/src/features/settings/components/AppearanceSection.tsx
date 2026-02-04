import type { ReactNode } from "react";
import { Moon, Sun } from "lucide-react";
import type { AllSettings } from "@/features/settings/types/settings";
import { Divider, ToggleRow } from "@/features/settings/components/SettingsUI";

type AppearanceSectionProps = {
  draft: AllSettings;
  setDraft: (v: AllSettings | null) => void;
};

export function AppearanceSection({ draft, setDraft }: AppearanceSectionProps) {
  const a = draft.appearance;

  return (
    <div className="grid gap-5">
      <Divider label="Tema" />
      <div className="grid grid-cols-2 gap-3 max-[980px]:grid-cols-1">
        <ThemeCard
          active={a.theme === "light"}
          title="Claro"
          icon={<Sun className="w-4 h-4" />}
          onClick={() =>
            setDraft({ ...draft, appearance: { ...a, theme: "light" } })
          }
        />
        <ThemeCard
          active={a.theme === "dark"}
          title="Escuro"
          icon={<Moon className="w-4 h-4" />}
          onClick={() =>
            setDraft({ ...draft, appearance: { ...a, theme: "dark" } })
          }
        />
      </div>

      <Divider label="Layout" />
      <ToggleRow
        title="Menu compacto"
        desc="Reduz largura do menu lateral para ganhar espaço."
        checked={a.compactMenu}
        onChange={(v) =>
          setDraft({ ...draft, appearance: { ...a, compactMenu: v } })
        }
      />

      <Divider label="Densidade" />
      <div className="grid grid-cols-2 gap-3 max-[980px]:grid-cols-1">
        <button
          className={`p-4 rounded-lg border text-left ${
            a.density === "comfortable"
              ? "bg-emerald-50 border-emerald-200"
              : "bg-white border-gray-200 hover:bg-gray-50"
          }`}
          onClick={() =>
            setDraft({ ...draft, appearance: { ...a, density: "comfortable" } })
          }
        >
          <div className="text-sm font-extrabold text-gray-900">
            Confortável
          </div>
          <div className="text-xs text-gray-500">
            Mais espaçamento em listas e cards.
          </div>
        </button>

        <button
          className={`p-4 rounded-lg border text-left ${
            a.density === "compact"
              ? "bg-emerald-50 border-emerald-200"
              : "bg-white border-gray-200 hover:bg-gray-50"
          }`}
          onClick={() =>
            setDraft({ ...draft, appearance: { ...a, density: "compact" } })
          }
        >
          <div className="text-sm font-extrabold text-gray-900">Compacta</div>
          <div className="text-xs text-gray-500">
            Ideal para listas grandes (ERP).
          </div>
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
        active
          ? "bg-emerald-50 border-emerald-200"
          : "bg-white border-gray-200 hover:bg-gray-50",
      ].join(" ")}
    >
      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
        {icon}
      </div>
      <div>
        <div className="text-sm font-extrabold text-gray-900">{title}</div>
        <div className="text-xs text-gray-500">
          Mantém visual limpo e legível.
        </div>
      </div>
    </button>
  );
}
