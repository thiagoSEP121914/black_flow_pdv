import { Input } from "@/shared/components";
import { useState } from "react";
import { Mail, Lock, User, Building2, Phone } from "lucide-react";

interface SignupDTO {
  email: string;
  password: string;
  name: string;
  companyName: string;
  phone?: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
  companyName?: string;
  phone?: string;
}

export default function SignUp() {
  const [formData, setFormData] = useState<SignupDTO>({
    email: "",
    password: "",
    name: "",
    companyName: "",
    phone: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    // Name validation
    if (!formData.name) {
      newErrors.name = "Nome é obrigatório";
    } else if (formData.name.length < 3) {
      newErrors.name = "Nome deve ter pelo menos 3 caracteres";
    }

    // Company name validation
    if (!formData.companyName) {
      newErrors.companyName = "Nome da empresa é obrigatório";
    } else if (formData.companyName.length < 3) {
      newErrors.companyName =
        "Nome da empresa deve ter pelo menos 3 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulação de chamada API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Signup data:", formData);
      setSuccess(true);

      // Redirecionar após sucesso
      setTimeout(() => {
        console.log("Redirecting to login...");
      }, 2000);
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({ email: "Erro ao criar conta. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof SignupDTO, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="w-12 h-12 bg-emerald-500 rounded-lg mb-8"></div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar Conta</h1>
          <p className="text-gray-600 mb-8">
            Comece a gerenciar seu negócio agora mesmo
          </p>

          {success ? (
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-2">
                Conta criada com sucesso!
              </h3>
              <p className="text-green-700">Redirecionando para o login...</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Name Input */}
              <Input
                label="Nome Completo"
                type="text"
                placeholder="Digite seu nome completo"
                value={formData.name}
                onChange={(value) => updateField("name", value)}
                error={errors.name}
                icon={<User size={20} />}
                required
              />

              {/* Email Input */}
              <Input
                label="Email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(value) => updateField("email", value)}
                error={errors.email}
                icon={<Mail size={20} />}
                required
              />

              {/* Phone Input */}
              <Input
                label="Telefone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={formData.phone || ""}
                onChange={(value) => updateField("phone", value)}
                icon={<Phone size={20} />}
                maxLength={15}
              />

              {/* Company Name Input */}
              <Input
                label="Nome da Empresa"
                type="text"
                placeholder="Nome do seu negócio"
                value={formData.companyName}
                onChange={(value) => updateField("companyName", value)}
                error={errors.companyName}
                icon={<Building2 size={20} />}
                required
              />

              {/* Password Input */}
              <Input
                label="Senha"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(value) => updateField("password", value)}
                error={errors.password}
                icon={<Lock size={20} />}
                required
              />

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-emerald-500 text-white py-4 rounded-lg hover:bg-emerald-600 transition font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Criando conta...
                  </>
                ) : (
                  "Criar Conta"
                )}
              </button>

              {/* Login Link */}
              <div className="text-center text-sm text-gray-600">
                Já tem uma conta?{" "}
                <a
                  href="/auth/login"
                  className="text-emerald-500 hover:text-emerald-600 font-semibold hover:underline"
                >
                  Fazer Login
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Illustration (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-500 to-emerald-600 items-center justify-center p-12">
        <div className="text-center text-white max-w-md">
          <div className="mb-8">
            <svg
              className="w-32 h-32 mx-auto mb-6"
              viewBox="0 0 200 200"
              fill="none"
            >
              <circle
                cx="100"
                cy="100"
                r="80"
                stroke="white"
                strokeWidth="4"
                opacity="0.3"
              />
              <circle cx="100" cy="100" r="60" fill="white" opacity="0.2" />
              <path
                d="M100 60 L100 100 L130 100"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">Sistema PDV Completo</h2>
          <p className="text-emerald-100 text-lg mb-6">
            Gerencie vendas, estoque, clientes e relatórios em um só lugar
          </p>
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-emerald-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>Controle de caixa em tempo real</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-emerald-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>Gestão completa de estoque</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-emerald-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>Relatórios financeiros detalhados</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-emerald-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>Multi-loja e multi-usuário</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
