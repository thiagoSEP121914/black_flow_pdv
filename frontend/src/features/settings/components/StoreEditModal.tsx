import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/Input/Input";
import type { Store } from "@/features/settings/types/settings";
import { Switch } from "@/features/settings/components/SettingsUI";

type StoreForm = {
  name: string;
  address: string;
  active: boolean;
};

type StoreEditModalProps = {
  open: boolean;
  store: Store | null;
  onClose: () => void;
  onSave: (next: StoreForm) => void;
};

export function StoreEditModal({
  open,
  store,
  onClose,
  onSave,
}: StoreEditModalProps) {
  const [form, setForm] = useState<StoreForm>({
    name: "",
    address: "",
    active: false,
  });

  useEffect(() => {
    if (!open || !store) return;
    setForm({
      name: store.name,
      address: store.address,
      active: store.active,
    });
  }, [open, store?.id]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !store) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Fechar modal"
      />

      <div className="relative w-full max-w-xl bg-white border border-gray-200 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <div className="text-sm font-extrabold text-gray-900">
              Editar Loja
            </div>
            <div className="text-xs text-gray-500">
              Ajuste nome, endereço e status.
            </div>
          </div>
          <Button variant="outlined" size="sm" onClick={onClose}>
            Fechar
          </Button>
        </div>

        <div className="p-5 grid gap-4">
          <Input
            label="Nome"
            value={form.name}
            onChange={(v) => setForm((p) => ({ ...p, name: v }))}
            placeholder="Nome da loja"
          />
          <Input
            label="Endereço"
            value={form.address}
            onChange={(v) => setForm((p) => ({ ...p, address: v }))}
            placeholder="Endereço completo"
          />

          <div className="flex items-start justify-between gap-4 p-4 rounded-lg border border-gray-200 bg-white">
            <div>
              <div className="text-sm font-extrabold text-gray-900">
                Loja ativa
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Se desativar, a loja fica como inativa no sistema.
              </div>
            </div>

            <Switch
              checked={form.active}
              onChange={(v) => setForm((p) => ({ ...p, active: v }))}
            />
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-2">
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
            onClick={() => onSave(form)}
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
}
