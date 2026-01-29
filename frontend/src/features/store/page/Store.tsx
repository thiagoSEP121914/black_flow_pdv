import { ActionToolbar } from "@/shared/components/ActionToolBar/ActionTooBar";
import { PageLayout } from "@/shared/layouts/PageLayout";
import { StoreCards } from "../components/StoreCards";

export const Store = () => {

  return (
    <PageLayout>
      <div className="flex flex-col h-full overflow-y-auto pr-2 space-y-6">
        <div className="flex flex-col">
          <ActionToolbar
            addButtonTitle="Nova Loja"
            showFilter={false}
          />
        </div>

        <StoreCards />
      </div>
    </PageLayout>
  );
};
