import { useState } from "react";
import { useRouter } from "next/router";
import { useApi } from "@/frontend/hooks/useApi";
import { useAuth } from "@/frontend/contexts/AuthContext";
import AuthLayout from "../../auth/AuthLayout";

export default function OTPPage() {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { id_usuario } = router.query;
    const { login } = useAuth();
    const api = useApi();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/auth/verify-otp', {
                id_usuario,
                otp
            });

            login(response.data.token);
            router.push(response.data.tipo_usuario === 'FUNCIONARIO' ? '/funcionario/dashboard' : '/cliente/dashboard');
        } catch (err) {
            setError('Código inválido ou expirado');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Verificação OTP">
            <p>Enviamos um código de 6 dígitos para seu e-mail</p>
            <form onSubmit={handleSubmit}>
                <Input type="text" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                placeholder="Digite o OTP" 
                maxLength={6} 
                required/>

                {error && <div className="error">{error}</div>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Verificando...' : 'Verificar'}
                </button>
            </form>
        </AuthLayout>
    );
}