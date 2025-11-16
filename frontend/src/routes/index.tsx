import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
<<<<<<< HEAD
import { Login, Dashboard, NotFound } from "@/pages";
=======
import { Login, Dashboard, NotFound, SignUp } from "@/pages";
>>>>>>> af29146 (git add src/pages/SignUp.tsx src/shared/components/Input.tsx src/pages/Login.tsx src/pages/index.ts src/routes/index.tsx src/shared/components/index.ts)
import { useAuth } from "@/shared/hooks";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
<<<<<<< HEAD
=======
        <Route path="/auth/signup" element={<SignUp />} />
>>>>>>> af29146 (git add src/pages/SignUp.tsx src/shared/components/Input.tsx src/pages/Login.tsx src/pages/index.ts src/routes/index.tsx src/shared/components/index.ts)

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
