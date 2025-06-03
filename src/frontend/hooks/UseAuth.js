import { useContext } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/frontend/contexts/AuthContext";

export default function useAuth() {
    const context = useContext(AuthContext);
    const router = useRouter();

    if(!context) {
        throw new Error('useAuth deve ser usado sentro de um AuthProvider');
    }

    const { user, token, login, logout, isAuthenticated, isFuncionario } = context;

    // Verifica se a rota requer autenticação/função específica
    const checkAccess = (requiredRole = null) => {
        if(!isAuthenticated()) {
            router.push('/auth/login');
            return false;
        }

        if(requiredRole === 'FUNCIONARIO' && !isFuncionario()) {
            router.push('/cliente/dashboard');
            return false;
        }

        return true;
    };

    //Login com redirecionamento automático
    const loginWithRedirect = async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            const otpResponse = await api.post('/auth/verify-otp', {
                id_usuario: response.data.id_usuario,
                otp: credentials.otp
            });

            login(otpResponse.data.token);
            const redirectPath = otpResponse.data.tipo_usuario === 'FUNCIONARIO'
                ? '/funcionario/dashboard'
                : '/cliente/dashboard';
            router.push(redirectPath);
        } catch(error) {
            throw error;
        }
    };

    return {
        user,
        token,
        login,
        loginWithRedirect,
        logout,
        isAuthenticated,
        isFuncionario,
        checkAccess
    };
}