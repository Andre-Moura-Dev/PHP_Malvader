import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/frontend/contexts/AuthContext";
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children, requiredRole = null }) {
    const router = useRouter();
    const { user, isAuthenticated, isFuncionario, loading } = useAuth();

    useEffect(() => {
        if(!loading) {
            // Se não tiver autenticado, redireciona para login
            if(!isAuthenticated) {
                router.push(`/auth/login?redirect=${encodeURIComponent(router.asPath)}`);
                return;
            }

            // Se a rota requer um tipo específico de usuário e não corresponde
            if(requiredRole === 'FUNCIONARIO' && !isFuncionario()) {
                router.push('/cliente/dashboard');
                return;
            }

            // Se a rota requer cliente e o usuário é funcionário
            if (requiredRole === 'CLIENTE' && isFuncionario()) {
                router.push('/funcionario/dashboard');
                return;
            }
        }
    }, [user, loading, router.asPath]);

    // Mostra um loading enquanto verifica autenticação
    if(loading || !isAuthenticated()) {
        return <LoadingSpinner />;
    }

    // Verificação final de permissão
    if(
        (requiredRole === 'FUNCIONARIO' && !isFuncionario()) ||
        (requiredRole === 'CLIENTE' && isFuncionario())
    ) {
        return null; // Ou componente de "Acesso negado"
    }

    return children;
}