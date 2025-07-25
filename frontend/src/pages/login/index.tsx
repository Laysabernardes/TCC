/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"; // Importa o useState
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import { TypeInput } from "../../components/inputs";
import { authService } from "../../service/authService"; 

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-gray-400" viewBox="0 0 16 16">
        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-gray-400" viewBox="0 0 16 16">
        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
    </svg>
);

// Ícones para visualizar/ocultar senha
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>
    </svg>
);

const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
);

const LoginIcon = () => (
    <svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Ícone de Login</title>
      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" className="text-red-2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" className="text-red-2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const LoginSchema = z.object({
  email: z.string().min(1, "Email é obrigatório.").email("Por favor, insira um email válido."),
  password: z.string().min(1, "Senha é obrigatória."),
});

type LoginFormData = z.infer<typeof LoginSchema>;

function Login() {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  // Configurar o react-hook-form com o resolver do Zod
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
      if(result.token) {
        localStorage.setItem("authToken", result.token);
      }
      navigate("/guara-adm");

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "An error occurred during login.";
      setApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="hero"
      className="w-full min-h-screen flex flex-col items-center justify-center bg-dark-1 p-4"
    >
      <section className="w-full max-w-4xl flex flex-row bg-dark-2 rounded-lg shadow-lg overflow-hidden">
        {/* Coluna do Ícone (visível em telas médias e maiores) */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-12 bg-dark-3">
          <LoginIcon />
        </div>

        {/* Coluna do Formulário */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <form
            onSubmit={handleSubmit(handleLogin)}
            className="p-8 sm:p-12"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-light-3">
                Acessar Painel
              </h2>
              <p className="text-light-4 mt-2">
                Faça login para gerenciar os projetos.
              </p>
            </div>

            {/* Exibição de erro da API */}
            {apiError && (
              <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-center">
                {apiError}
              </div>
            )}

            {/* Campo de Email */}
            <TypeInput
              id="email"
              title="Email"
              type="email"
              placeholder="seuemail@exemplo.com"
              icon={<UserIcon />}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-3 text-sm mt-[-10px] mb-3">{errors.email.message}</p>
            )}

            {/* Campo de Senha com botão de visualização */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-light-3 text-sm font-bold mb-2">
                  Senha
              </label>
              <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <LockIcon />
                  </span>
                  <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="********"
                      className={`w-full bg-dark-3 text-light-2 border rounded-lg py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-red-2 ${errors.password ? 'border-red-3' : 'border-dark-4'}`}
                      {...register("password")}
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
              </div>
            </div>
            {errors.password && (
              <p className="text-red-3 text-sm mt-[-10px] mb-3">{errors.password.message}</p>
            )}

            {/* Botão de Submissão */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-2 text-lg font-bold text-white text-center rounded-lg p-3 mt-5 cursor-pointer transition-transform duration-200 hover:bg-red-1 hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            <div className="text-center mt-6">
                <Link to="/" className="text-sm text-light-4 hover:text-red-2 transition-colors">
                    Esqueceu a senha?
                </Link>
            </div>

          </form>
        </div>
      </section>
    </div>
  );
}

export default Login;