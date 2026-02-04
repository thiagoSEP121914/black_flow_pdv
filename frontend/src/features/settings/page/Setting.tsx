import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Building2, User, Bell, Shield, Palette, Save, Laptop } from "lucide-react";

import { Card } from "@/shared/components/Cards/Card";
import { Button } from "@/shared/components/ui/Button";

import { settingsMock } from "@/features/settings/mock/settingsMock";
import type { AllSettings, Role } from "@/features/settings/types/settings";
import type { CompanyTab, SectionKey } from "@/features/settings/types/ui";
import { CompanySection } from "@/features/settings/components/CompanySection";
import { UserSection } from "@/features/settings/components/UserSection";
import { NotificationsSection } from "@/features/settings/components/NotificationsSection";
import { SecuritySection } from "@/features/settings/components/SecuritySection";
import { AppearanceSection } from "@/features/settings/components/AppearanceSection";
import { SettingsMenu } from "@/features/settings/components/SettingsMenu";
import { StoreEditModal } from "@/features/settings/components/StoreEditModal";

export function Setting() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [active, setActive] = useState<SectionKey>("company");
  const [search] = useState("");

  const [companyTab, setCompanyTab] = useState<CompanyTab>("dados");
  const [draft, setDraft] = useState<AllSettings | null>(null);

  // ---------------- Modal edição de Loja (Editar) ----------------
  const [storeEditId, setStoreEditId] = useState<string | null>(null);

  const storeToEdit = useMemo(() => {
    if (!draft || !storeEditId) return null;
    return draft.stores.find((s) => s.id === storeEditId) ?? null;
  }, [draft, storeEditId]);

  const closeStoreModal = () => setStoreEditId(null);

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
      {
        key: "company" as const,
        label: "Empresa",
        icon: <Building2 className="w-4 h-4" />,
      },
      {
        key: "user" as const,
        label: "Usuário",
        icon: <User className="w-4 h-4" />,
      },
      {
        key: "notifications" as const,
        label: "Notificações",
        icon: <Bell className="w-4 h-4" />,
      },
      {
        key: "security" as const,
        label: "Segurança",
        icon: <Shield className="w-4 h-4" />,
      },
      {
        key: "appearance" as const,
        label: "Aparência",
        icon: <Palette className="w-4 h-4" />,
      },
    ],
    [],
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
            <div className="p-5 text-gray-600 font-semibold">
              Carregando Configurações...
            </div>
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
          <SettingsMenu
            title="Menu"
            icon={<Laptop className="w-4 h-4" />}
            items={filteredMenu}
            active={active}
            onChange={(key) => setActive(key)}
          />

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
                <UserSection
                  draft={draft}
                  setDraft={setDraft}
                  isAdminOrManager={isAdminOrManager}
                />
              )}

              {/* NOTIFICATIONS */}
              {active === "notifications" && (
                <NotificationsSection
                  draft={draft}
                  setDraft={setDraft}
                  isAdminOrManager={isAdminOrManager}
                />
              )}

              {/* SECURITY */}
              {active === "security" && (
                <SecuritySection
                  draft={draft}
                  setDraft={setDraft}
                  isAdminOrManager={isAdminOrManager}
                />
              )}

              {/* APPEARANCE */}
              {active === "appearance" && (
                <AppearanceSection draft={draft} setDraft={setDraft} />
              )}
            </div>
          </Card>
        </div>
      </div>

      <StoreEditModal
        open={Boolean(storeEditId)}
        store={storeToEdit}
        onClose={closeStoreModal}
        onSave={(next) => {
          if (!draft || !storeEditId) return;
          const nextStores = draft.stores.map((s) =>
            s.id === storeEditId ? { ...s, ...next } : s,
          );
          setDraft({ ...draft, stores: nextStores });
          toast.success("Loja atualizada (mock).");
          closeStoreModal();
        }}
      />
    </div>
  );
}

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
