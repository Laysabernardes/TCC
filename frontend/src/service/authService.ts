import api from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
}

// Objeto que agrupa todas as funções de autenticação
export const authService = {
  /**
   * Envia as credenciais de login para a API.
   * @param credentials - Um objeto com email e senha.
   * @returns A promessa com os dados da resposta (token e usuário).
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  // Futuramente, você pode adicionar outras funções aqui:
  // register: async (data) => { ... },
  // logout: async () => { ... },
};
