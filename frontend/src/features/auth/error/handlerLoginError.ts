import { AxiosError } from "axios";
import { toast } from "react-toastify";

export function handleLoginError(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "isAxiosError" in error &&
    (error as AxiosError).isAxiosError
  ) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 401) {
      toast.error("Email ou senha incorreto");
      return;
    }
    const message =
      (axiosError.response?.data as { error?: string })?.error ||
      "Erro inesperado";
    toast.error(message);
    return;
  }

  if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error("Erro inesperado");
  }
}
