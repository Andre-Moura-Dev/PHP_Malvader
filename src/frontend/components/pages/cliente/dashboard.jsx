import { useEffect, useState } from "react";
import { useApi } from "@/frontend/hooks/useApi";
import { useAuth } from "@/frontend/contexts/AuthContext";
import Layout from "../../shared/Layout";
import ContaCard from "../../cliente/ContaCard";

export default function DashboardCliente() {
    const [contas, setContas] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
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

    return (
        <Layout title="Dashboard">
            <h1>Olá, {user?.nome.split(' ')[0]}!</h1>
            <h2>Suas Contas</h2>

            {loading ? (
                <p>Carregando suas contas...</p>
            ) : contas.length === 0 ? (
                <p>Voçê não possui contas cadastradas.</p>
            ) : (
                <div className="contas-grid">
                    {contas.map((conta) => (
                        <ContaCard key={conta.id_conta} conta={conta} />
                    ))}
                </div>
            )}
        </Layout>
    );
}