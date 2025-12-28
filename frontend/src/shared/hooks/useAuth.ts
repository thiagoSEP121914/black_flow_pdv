import { useContext } from "react";
import { AuthContext } from "../../features/auth/context/AuthContextData";

export function useAuth() {
  return useContext(AuthContext);
}
