import { useState, useEffect } from "react";
import { useApi } from "@/frontend/hooks/useApi";
import Layout from "../../shared/Layout";
import TransferenciaForm from "../../cliente/TransferenciaForm";

export default function TransferenciaPage() {
    const [contas, setContas] = useState([]);
    const [loading, setLoading] = useState(true);
    const api = useApi();

    useEffect(() => {
        const carregarContas = async () => {
            try {
                const response = await api.get('/cliente/contas');
                setContas(response.data);
            } catch (error) {
                console.error('Erro ao carregar contas:', error);
            } finally {
                setLoading(false);  
            }
        };

        carregarContas();
    }, []);

    const handleSuccess = () => {
        router.push('/cliente/dashboard');
    };

    return (
        <Layout title="Realizar Transferência">
            {loading ? (
                <p>Carregando suas contas...</p>
            ) : contas.length === 0 ? (
                <p>Voçe não possui contas para transferência.</p>
            ) : (
                <TransferenciaForm contasCliente={contas} onSuccess={handleSuccess}/>
            )}
        </Layout>
    );
}