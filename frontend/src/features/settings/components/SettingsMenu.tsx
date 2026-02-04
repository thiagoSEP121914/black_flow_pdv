import type { ReactNode } from "react";
import { Card } from "@/shared/components/Cards/Card";
import type { SectionKey } from "@/features/settings/types/ui";
import { MenuItem } from "@/features/settings/components/SettingsUI";

type MenuItemData = {
  key: SectionKey;
  label: string;
  icon: ReactNode;
};

type SettingsMenuProps = {
  title: string;
  icon: ReactNode;
  items: MenuItemData[];
  active: SectionKey;
  onChange: (key: SectionKey) => void;
};

export function SettingsMenu({
  title,
  icon,
  items,
  active,
  onChange,
}: SettingsMenuProps) {
  return (
    <Card title={title} icon={icon}>
      <div className="p-3">
        {items.length === 0 ? (
          <div className="text-sm text-gray-500 p-2">Nenhum item encontrado.</div>
        ) : (
          <div className="flex flex-col gap-1">
            {items.map((item) => (
              <MenuItem
                key={item.key}
                active={active === item.key}
                label={item.label}
                icon={item.icon}
                onClick={() => onChange(item.key)}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
