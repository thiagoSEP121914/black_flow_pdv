import React from "react";
import { SideBar } from "@/shared/components";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        {/* Header virá aqui */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};
