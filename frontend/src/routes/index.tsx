import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Login, Dashboard, NotFound } from "@/pages";
import { useAuth } from "@/shared/hooks";

// Rota protegida
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

// Definição das rotas
export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/404" element={<NotFound />} />

        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
};
