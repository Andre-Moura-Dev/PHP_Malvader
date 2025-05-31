import { useState } from "react";
import { useRouter } from "next/router";
import { useApi } from "@/frontend/hooks/useApi";
import AuthLayout from "../../auth/AuthLayout";

export default function LoginPage() {
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const api = useApi();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login. verifique suas credenciais.');
            router.push({
                pathname: '/auth/otp',
                query: { id_usuario: response.data.id_usuario }
            });
        } catch (err) {
            setError(err.error || 'Falha no login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="login - banco Malvader">
            
        </AuthLayout>
    )
}