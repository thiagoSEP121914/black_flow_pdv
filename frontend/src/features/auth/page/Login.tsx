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

      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 items-center justify-center p-12">
        <svg viewBox="0 0 500 500" className="w-full max-w-lg h-auto">
          <rect x="20" y="100" width="460" height="5" fill="#e5e7eb" />
          <rect x="20" y="180" width="460" height="5" fill="#e5e7eb" />

          <g>
            <rect
              x="50"
              y="280"
              width="180"
              height="120"
              rx="8"
              fill="#1f2937"
            />
            <rect
              x="60"
              y="290"
              width="160"
              height="80"
              rx="4"
              fill="#34d399"
            />
            <rect
              x="70"
              y="300"
              width="140"
              height="60"
              rx="2"
              fill="#10b981"
            />
            <text
              x="140"
              y="335"
              fontSize="24"
              fill="#fff"
              fontWeight="bold"
              textAnchor="middle"
            >
              R$ 0,00
            </text>

            <g>
              <circle cx="80" cy="385" r="6" fill="#6b7280" />
              <circle cx="100" cy="385" r="6" fill="#6b7280" />
              <circle cx="120" cy="385" r="6" fill="#6b7280" />
              <circle cx="140" cy="385" r="6" fill="#6b7280" />
              <circle cx="160" cy="385" r="6" fill="#6b7280" />
              <circle cx="180" cy="385" r="6" fill="#6b7280" />
              <circle cx="200" cy="385" r="6" fill="#6b7280" />
            </g>
          </g>

          <g>
            <circle cx="330" cy="180" r="35" fill="#fbbf77" />
            <path
              d="M 295 175 Q 295 140 330 140 Q 365 140 365 175 L 365 185 Q 365 165 330 165 Q 295 165 295 185 Z"
              fill="#1f2937"
            />
            <path
              d="M 295 215 L 280 250 L 280 340 L 330 340 L 380 340 L 380 250 L 365 215 Z"
              fill="#3b82f6"
            />
            <ellipse
              cx="265"
              cy="270"
              rx="35"
              ry="15"
              fill="#fbbf77"
              transform="rotate(-25 265 270)"
            />
            <ellipse
              cx="395"
              cy="270"
              rx="35"
              ry="15"
              fill="#fbbf77"
              transform="rotate(25 395 270)"
            />

            <circle cx="240" cy="300" r="12" fill="#fbbf77" />
            <path
              d="M 240 300 L 220 310 L 215 305 L 235 295 Z"
              fill="#fbbf77"
            />
          </g>

          <g>
            <rect
              x="260"
              y="360"
              width="50"
              height="30"
              rx="4"
              fill="#dc2626"
            />
            <rect
              x="265"
              y="365"
              width="40"
              height="20"
              rx="2"
              fill="#374151"
            />
          </g>

          <g>
            <rect
              x="380"
              y="320"
              width="40"
              height="50"
              rx="3"
              fill="#f59e0b"
            />
            <rect
              x="385"
              y="325"
              width="30"
              height="8"
              fill="#fff"
              opacity="0.3"
            />

            <rect
              x="430"
              y="310"
              width="40"
              height="60"
              rx="3"
              fill="#10b981"
            />
            <rect
              x="435"
              y="315"
              width="30"
              height="8"
              fill="#fff"
              opacity="0.3"
            />
          </g>

          <rect x="30" y="400" width="440" height="12" rx="6" fill="#9ca3af" />
          <rect x="30" y="412" width="440" height="40" fill="#6b7280" />

          <g opacity="0.3">
            <circle cx="120" cy="150" r="20" fill="#34d399" />
            <text x="120" y="158" fontSize="20" fill="#fff" textAnchor="middle">
              $
            </text>
            <rect
              x="350"
              y="130"
              width="40"
              height="28"
              rx="4"
              fill="#3b82f6"
            />
            <rect x="355" y="135" width="10" height="8" rx="1" fill="#fbbf77" />
          </g>

          <text
            x="250"
            y="80"
            fontSize="28"
            fill="#1f2937"
            fontWeight="bold"
            textAnchor="middle"
          >
            Seu PDV Moderno
          </text>
        </svg>
      </div>
    </div>
  );
}
