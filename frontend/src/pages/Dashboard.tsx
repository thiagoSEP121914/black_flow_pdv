import { MainLayout } from "@/layouts";

export const Dashboard = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Dashboard cards virão aqui */}
        </div>
      </div>
    </MainLayout>
  );
};
