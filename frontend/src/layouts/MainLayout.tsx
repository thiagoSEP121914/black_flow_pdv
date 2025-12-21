import React from "react";
import { SideBar } from "@/shared/components";
import { Header } from "@/shared/components/Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 flex flex-col overflow-hidden ml-56">
        {/* Header virá aqui */}
        <Header title={"Dashboard"} subtitle={"Visão geral do seu negócio"} />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
};
