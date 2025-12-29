import { AppRoutes } from "@/shared/routes";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./features/auth/context/AuthContext";

function App() {
  return (
    <>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer />
      </AuthProvider>
    </>
  );
}

export default App;
