/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { TypeInput, PasswordInput } from "../components/Inputs";
import { authService } from "../features/auth/auth.service";
import logo from "../assets/logo.png";

import { FaRegUser } from "react-icons/fa6";

const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório.")
    .email("Por favor, insira um email válido."),
  password: z.string().min(1, "Senha é obrigatória."),
});

type LoginFormData = z.infer<typeof LoginSchema>;

function Login() {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorType = searchParams.get("error");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    setApiError(null);

    try {
      const result = await authService.login(data);

      if (result.forcePasswordReset) {
        navigate("/reset-password", {
          state: {
            userId: result.userId,
            email: result.email,
          },
        });
        return;
      }

      if (result.token) {
        localStorage.setItem("authToken", result.token);
      }
      navigate("/guara-adm");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Erro ao fazer login. Tente novamente.";
      setApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-gray-200">
      <header className="border-b border-gray-800 bg-gray-900 px-5 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <img src={logo} alt="Usina Guará" className="h-11 w-11 drop-shadow-md" />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-wide text-gray-400">
                Usina Guará
              </span>
              <span className="text-base font-bold text-white">Painel administrativo</span>
            </div>
          </Link>
          <Link
            to="/"
            className="shrink-0 text-sm font-medium text-gray-400 underline-offset-4 transition hover:text-red-500 hover:underline"
          >
            Voltar ao site
          </Link>
        </div>
      </header>

      <div
        className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 px-4 py-12"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(237, 32, 36, 0.12), transparent)",
        }}
      >
        <div className="w-full max-w-md rounded-2xl border border-gray-700/80 bg-gray-800/35 p-8 shadow-xl backdrop-blur-sm sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Entrar</h1>
            <p className="mt-2 text-sm text-gray-400">
              Acesso restrito à equipe para gerenciar projetos e conteúdos.
            </p>
          </div>

          {errorType === "expired" && (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-amber-600/40 bg-amber-950/40 px-4 py-3 text-center text-sm text-amber-100"
            >
              Sua sessão expirou por inatividade. Faça login novamente.
            </div>
          )}

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-1">
            {apiError && (
              <div
                role="alert"
                className="mb-4 rounded-lg border border-red-600/30 bg-red-950/40 px-4 py-3 text-center text-sm text-red-200"
              >
                {apiError}
              </div>
            )}

            <TypeInput
              id="email"
              title="E-mail"
              type="email"
              placeholder="seuemail@exemplo.com"
              icon={<FaRegUser />}
              {...register("email")}
            />
            {errors.email && (
              <p className="mb-3 text-sm text-red-400">{errors.email.message}</p>
            )}

            <PasswordInput
              id="password"
              title="Senha"
              placeholder="••••••••"
              {...register("password")}
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-red-600 py-3 text-center text-base font-semibold text-white shadow-lg transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:opacity-80"
            >
              {loading ? "Entrando…" : "Entrar"}
            </button>

            <div className="mt-6 text-center">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-gray-400 underline-offset-4 transition hover:text-red-400 hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>
          </form>
        </div>

        <p className="mt-10 max-w-md text-center text-xs text-gray-500">
          Problemas para acessar? Entre em contato com a equipe da Usina Guará.
        </p>
      </div>
    </div>
  );
}

export default Login;
