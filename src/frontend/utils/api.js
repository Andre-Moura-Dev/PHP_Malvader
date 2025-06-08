import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Cria uma instância base do Axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptador para adicionar o token de autenticação
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('malvader_token');
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptador para tratar erros globais
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Tratamento específico para token expirado
            if (error.response.status === 401) {
                localStorage.removeItem('malvader_token');
                window.location.href = '/auth/login';
            }

            return Promise.reject({
                error: error.response.data?.message || 'Erro na requisição',
                status: error.response.status
            });
        }
        return Promise.reject({ error: 'Erro de conexão' });
    }
);

// Funções específicas do Banco Malvader
export const bancoMalvaderAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    verifyOTP: (data) => api.post('/auth/veirfy-otp', data),

    // Contas
    getContas: () => api.get('/cliente/contas'),
    criarContas: (data) => api.post('/funcionario/conta/abrir', data),
    atualizarConta: (numeroConta, data) => api.post('/funcionario/conta/bloquear', { numeroConta: numeroConta }),

    // Transações
    depositar: (data) => api.post('/cliente/deposito', data),
    sacar: (data) => api.post('/cliente/saque', data),
    transferir: (data) => api.post('/cliente/transferencia', data),
    getExtrato: (contaId, periodo) => api.get(`/cliente/extrato/${contaId}`, {params }),

    // Relatórios
    gerarRelatorio: (data) => api.post('/relatorio/gerar', data),
    getRelatorio: () => api.get('/relatorios'),

    // Clientes
    getClientes: () => api.get('/funcionario/clientes'),
    criarClientes: (data) => api.post('/auth/regsiter', data),

    // Funcionários
    criarFuncionario: (data) => api.post('/funcionario/cadastrar', data)
};

// Hook personalizado para usar a API
export const useAPI = () => {
    const { token } = useAuth();

    // Atualizar
    if(token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return bancoMalvaderAPI;
};

export default api;