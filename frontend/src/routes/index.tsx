import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Login, Dashboard, NotFound, SignUp } from "@/pages";
import { useAuth } from "@/shared/hooks/useAuth";

// Rota protegida
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    console.error("carregando");
  } // spinner opcional

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  console.log("ProtectedRoute:", { isAuthenticated, loading });

  return <>{children}</>;
};

// Definição das rotass
export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<SignUp />} />

        <Route
          path="/dashboard"
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
