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
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>CPF</label>
                    <Input type="text" 
                    value={cpf} 
                    onChange={(e) => setCpf(e.target.value.replace(/\D/g, ''))} 
                    placeholder="Digite o seu Cpf" 
                    required/>
                </div>
                <div className="form-group">
                    <label>SENHA</label>
                    <Input type="password" 
                    value={senha} 
                    onChange={(e) => setSenha(e.target.value)} 
                    placeholder="Informe a sua senha" 
                    required/>
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Carregando...' : 'Entrar'}
                </button>
            </form>
        </AuthLayout>
    );
}