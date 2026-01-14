import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Login, Dashboard, NotFound, SignUp } from "@/shared/pages";
import { useAuth } from "@/shared/hooks/useAuth";
import { toast } from "react-toastify";
import { MainLayout } from "@/shared/layouts";
import { Pos } from "@/features/pos/page/Pos";
import { Product } from "@/features/product/page/Product";
import { Categorie } from "@/features/categories/page/Categorie";
import { Client } from "@/features/clients/page/Client";
import { Sale } from "@/features/sales/page/Sale";
import { Cashier } from "@/features/cashier/page/Cashier";
import { Finance } from "@/features/Finance/page/Finance";
import { Store } from "@/features/store/page/Store";
import { Setting } from "@/features/settings/page/Setting";

// Rota protegida
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return toast.info("Loading");
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

// Definição das rotass
export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Raiz*/}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        {/*Rotas Públicas */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<SignUp />} />

        {/* Rotas protegidas */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pdv" element={<Pos />} />
          <Route path="/products" element={<Product />} />
          <Route path="/categories" element={<Categorie />} />
          <Route path="/Clients" element={<Client />} />
          <Route path="/sales" element={<Sale />} />
          <Route path="/cashier" element={<Cashier />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/store" element={<Store />} />
          <Route path="/settings" element={<Setting />} />

          {/* Adicione outras rotas aqui conforme for criando */}
        </Route>

        <Route path="/404" element={<NotFound />} />

        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
};
