import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/features/auth/schemas/login.schema";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/hooks/useAuth";
import { handleLoginError } from "../error/handlerLoginError";

import { Store } from "lucide-react";

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
      await login(data);
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      handleLoginError(error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ESQUERDA */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Marca */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
              <Store size={24} />
            </div>

            {/* ✅ trocado aqui */}
            <span className="text-2xl font-bold text-gray-900 tracking-tight">
              NextFlow PDV
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
          <p className="text-gray-600 mb-10">Cresça seu negócio com confiança.</p>

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

      {/* DIREITA */}
      <div className="hidden lg:flex flex-1 bg-emerald-600 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-emerald-300 blur-3xl" />
        </div>

        <div className="relative z-10 text-center space-y-8 max-w-2xl">
          {/* imagem maior */}
          <div className="mx-auto w-[420px] xl:w-[560px] max-w-[92%]">
            <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl p-5">
              <img
                src="/Mascote.jpeg"
                alt="Mascote NextFlow"
                className="w-full h-auto rounded-2xl object-contain"
                draggable={false}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">Gerencie seu negócio</h2>
            <p className="text-emerald-100 text-lg">
              Sistema completo de PDV para controle de vendas, estoque e financeiro.
            </p>
          </div>

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
