import { useState } from "react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    console.log("Login:", { email, password });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form (50% width) */}
      <div className="w-1/2 lg-w-1/2 bg-white flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="w-12 h-12 bg-cyan-400 rounded-lg mb-8"></div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
          <p className="text-gray-600 mb-10">
            Cresça seu negócio com confiança.
          </p>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Usuário*
              </label>
              <input
                type="email"
                placeholder="Entre com seu Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password*
              </label>
              <input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-emerald-500 text-white py-4 rounded-lg hover:bg-emerald-600 transition font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              Login
            </button>
          </div>

          {/* Footer text */}
          <div className="mt-8 text-sm text-gray-600">
            <p>
<<<<<<< HEAD
              Ainda não tem acesso? Adquira sua chave de licença agora:{" "}
              <a
                href="https://github.com/thiagosHPD1914/delta_pdv"
                className="text-cyan-500 hover:text-cyan-600 font-medium hover:underline"
              >
                https://github.com/thiagosHPD1914/delta_pdv
=======
              Ainda não tem acesso?{" "}
              <a
                href="/auth/signup"
                className="text-emerald-500 hover:text-emerald-600 font-medium hover:underline"
              >
                Criar conta
>>>>>>> af29146 (git add src/pages/SignUp.tsx src/shared/components/Input.tsx src/pages/Login.tsx src/pages/index.ts src/routes/index.tsx src/shared/components/index.ts)
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration (50% width) */}
      <div className="w-1/2 bg-gray-50 flex items-center justify-center p-12">
        <svg viewBox="0 0 500 500" className="w-full max-w-lg h-auto">
          {/* Background elements - Store shelves */}
          <rect x="20" y="100" width="460" height="5" fill="#e5e7eb" />
          <rect x="20" y="180" width="460" height="5" fill="#e5e7eb" />

          {/* Cash register / POS terminal */}
          <g>
            {/* Base */}
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

            {/* Screen display */}
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

            {/* Keyboard */}
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

          {/* Person (cashier) */}
          <g>
            {/* Head */}
            <circle cx="330" cy="180" r="35" fill="#fbbf77" />

            {/* Hair */}
            <path
              d="M 295 175 Q 295 140 330 140 Q 365 140 365 175 L 365 185 Q 365 165 330 165 Q 295 165 295 185 Z"
              fill="#1f2937"
            />

            {/* Body - Shirt */}
            <path
              d="M 295 215 L 280 250 L 280 340 L 330 340 L 380 340 L 380 250 L 365 215 Z"
              fill="#3b82f6"
            />

            {/* Arms */}
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

            {/* Hands pointing to POS */}
            <circle cx="240" cy="300" r="12" fill="#fbbf77" />
            <path
              d="M 240 300 L 220 310 L 215 305 L 235 295 Z"
              fill="#fbbf77"
            />
          </g>

          {/* Products on counter */}
          <g>
            {/* Barcode scanner */}
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

          {/* Shopping items */}
          <g>
            {/* Product boxes */}
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

          {/* Counter/desk */}
          <rect x="30" y="400" width="440" height="12" rx="6" fill="#9ca3af" />
          <rect x="30" y="412" width="440" height="40" fill="#6b7280" />

          {/* Decorative elements - Money/card icons */}
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

          {/* Title text */}
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

      {/* Footer Text */}
      <div className="absolute bottom-4 left-4 right-4 text-xs text-gray-400 text-center">
        <p className="truncate">
          adore.mode/marketplace/vectors/illustration_person/50/S1/it.avyc/file/from/images/vectors/black_line_art/denisode/courses/fam.jz7796-12-ot.days
        </p>
      </div>
    </div>
  );
}
