import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginInput,
} from "@/features/auth/schemas/login.schema";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/hooks/useAuth";
import { handleLoginError } from "../error/handlerLoginError";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await login(data); // ou login retorna void, então use user direto do context depois
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      handleLoginError(error);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="w-12 h-12 bg-cyan-400 rounded-lg mb-8"></div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
          <p className="text-gray-600 mb-10">
            Cresça seu negócio com confiança.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Usuário*
              </label>
              <input
                type="email"
                placeholder="Entre com seu Email"
                {...register("email")}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
              />
              {errors.email && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password*
              </label>
              <input
                type="password"
                placeholder="Digite sua senha"
                {...register("password")}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
              />
              {errors.password && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-500 text-white py-4 rounded-lg hover:bg-emerald-600 transition font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? "Entrando..." : "Login"}
            </button>
          </form>

          {/* Footer text */}
          <div className="mt-8 text-sm text-gray-600">
            <p>
              Ainda não tem acesso?{" "}
              <a
                href="/auth/signup"
                className="text-emerald-500 hover:text-emerald-600 font-medium hover:underline"
              >
                Criar conta
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-emerald-600 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-emerald-300 blur-3xl" />
        </div>

        <div className="relative z-10 text-center space-y-8 max-w-lg">
          <div className="relative mx-auto w-80 h-80">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-48 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 overflow-hidden">
                <div className="h-6 bg-white/10 flex items-center gap-1.5 px-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-white/20 rounded w-3/4" />
                  <div className="h-3 bg-white/10 rounded w-full" />
                  <div className="h-3 bg-white/10 rounded w-5/6" />
                  <div className="flex gap-2 mt-4">
                    <div className="h-8 w-16 bg-emerald-500 rounded" />
                    <div className="h-8 w-16 bg-white/10 rounded" />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 right-8 w-16 h-16 bg-white/10 rounded-xl backdrop-blur-md flex items-center justify-center animate-pulse">
              <div className="w-8 h-8 bg-emerald-400 rounded-lg" />
            </div>
            <div className="absolute bottom-8 -left-4 w-14 h-14 bg-white/10 rounded-xl backdrop-blur-md flex items-center justify-center animate-pulse delay-500">
              <div className="w-7 h-7 bg-emerald-300 rounded-lg" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">
              Gerencie seu negócio
            </h2>
            <p className="text-emerald-100 text-lg">
              Sistema completo de PDV para controle de vendas, estoque e financeiro.
            </p>
          </div>

          {/* Features */}
          <div className="flex justify-center gap-6 text-emerald-100 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white" />
              Multi-lojas
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white" />
              Relatórios
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white" />
              Controle total
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
