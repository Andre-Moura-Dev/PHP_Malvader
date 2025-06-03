import { useEffect, useState } from "react";
import { useApi } from "@/frontend/hooks/useApi";
import Layout from "../../shared/Layout";

export default function DashboardFuncionario() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const api = useApi();

    useEffect(() => {
        const carregarClientes = async () => {
            try {
                const response = await api.get('/funcionario/clientes');
                setClientes(response.data);
            } catch (error) {
                console.error('Erro ao carregar clientes:', error);
            } finally {
                setLoading(false);
            }
        };

        carregarClientes();
    }, []);

    return (
        <Layout title="Dashboard Funcionário">
            <h1>Painel do Funcionário</h1>

            <div className="stats">
                <div className="stat-card">
                    <h3>Total de Clientes</h3>
                    <p>{loading ? '...' : clientes.length}</p>
                </div>

                <div className="quick-actions">
                    <button onClick={() => router.push('/funcionario/abrir-conta')}>
                        Abrir Nova Conta
                    </button>
                    <button onClick={() => router.push('/funcionario/cadastrar-funcionario')}>
                        Cadastrar Funcionário
                    </button>
                </div>
            </div>
        </Layout>
    );
}