import { useState, useEffect } from "react";
import { useApi } from "@/frontend/hooks/useApi";
import { useAuth } from "@/frontend/contexts/AuthContext";
import Layout from "../../shared/Layout";
import ProtectedRoute from "../../shared/ProtectedRoute";
import { toast } from "react-toastify";
import styled from "styled-components";
import { set } from "react-hook-form";

const ManagementContainer = styled.div `
    max-width: 1200px;
    margin: 2rem auto;
    padding: 2rem;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ManagementHeader = styled.div `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
`;

const ManagementTitle = styled.h2 `
    color: #2a4365;
`;

const SearchBar = styled.div `
    display: flex;
    gap: 1rem;
`;

const ManagementTable = styled.table `
    width: 100%;
    border-collapse;
    margin-top: 1rem;

    th, td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid #eee;
    }

    th {
        background-color: #f5f7fa;
        font-weight: 600;
    }

    tr:hover {
        background-color: #f8fafc;
    }
`;

const StatusBadge = styled.span`
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;

    &.ativa {
        background-color: #c6f6d5;
        color: #22543d;
    }

    &.bloqueada {
        background-color: #fed7d7;
        color: #822727;
    }

    &.encerrada {
        background-color: #e2e8f0;
        color: #1a365d;
    }
`;
const ActionButton = styled.button `
    padding: 0.25rem 0.5rem;
    margin-right: 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.8;
    }

    &.bloquear {
        background-color: #e53e3e;
        color: white;
    }

    &.desbloquear {
        background-color: #38a169;
        color: white;
    }

    &.encerrar {
        background-color: #718096;
        color: white;
    }
`;

export default function GerenciarContasPage() {
    const api = useApi();
    const [loading, setLoading] = useState(false);
    const [contas, setContas] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [statusFilter, setStatusFilter] = useState('TODAS');

    const carregarContas = async () => {
        setLoading(true);
        try {
            const response = await api.get('/funcionario/contas');
            setContas(response.data);
        } catch (error) {
            toast.error('Erro ao carregar contas');
        } finally {
            setLoading(false);
        }
    };

    const atualziarStatusConta = async (numeroConta, acao) => {
        try {
            await api.post(`/funcionario/conta/${acao}`, { numeroConta: numeroConta });
            toast.success(`Conta ${acao.toLowerCase()} com sucesso!`);
            await carregarContas();
        } catch (error) {
            toast.error(error.error || `Erro ao ${acao.toLowerCase()} conta`);
        }
    };

    useEffect(() => {
        carregarContas();
    }, []);

    const contasFiltradas = contas.filter(conta => {
        const matchesSearch =
            conta.numero_conta.toLowerCase().includes(filtro.toLowerCase()) ||
            conta.cliente.nome.toLowerCase().includes(filtro.toLowerCase());

        const matchesStatus =
            statusFilter === 'TODAS' ||
            conta.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        switch(status) {
            case 'ATIVA':
                return <StatusBadge className="ativa">Ativa</StatusBadge>;
            case 'BLOQUEADA':
                return <StatusBadge className="bloqueada">Bloqueada</StatusBadge>;
            case 'ENCERRADA':
                return <StatusBadge className="encerrada">Encerrada</StatusBadge>;
            default:
                return status;
        }
    };

    return (
        <ProtectedRoute requiredRole="FUNCIONARIO">
            <Layout title="Gerenciar Contas">
                <ManagementContainer>
                    <ManagementTitle>Gerenciamento de Contas</ManagementTitle>

                    <SearchBar>
                        <input type="text" 
                            placeholder="Buscar por número ou cliente" 
                            value={filtro} 
                            onChange={(e) => setFiltro(e.target.value)} 
                            />
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value="TODAS">Todas</option>
                                <option value="ATIVAS">Ativas</option>
                                <option value="BLOQUEADA">Bloqueadas</option>
                                <option value="ENCERRADA">Encerradas</option>
                            </select>
                    </SearchBar>
                </ManagementContainer>


                {loading ? (
                    <p>Carregando contas...</p>
                ) : (
                    <ManagementTable>
                        <thead>
                            <tr>
                                <th>Número</th>
                                <th>Cliente</th>
                                <th>Tipo</th>
                                <th>Saldo</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contasFiltradas.map((conta) => (
                                <tr key={conta.numero_conta}>
                                    <td>{conta.numero_conta}</td>
                                    <td>{conta.cliente.nome}</td>
                                    <td>{conta.tipo_conta}</td>
                                    <td>R$ {conta.saldo.toFixed(2)}</td>
                                    <td>{getStatusBadge(contas.status)}</td>
                                    <td>
                                        {contas.status === 'ATIVA' && (
                                            <>
                                                <ActionButton className="bloquear" 
                                                onClick={() => atualziarStatusConta(conta.numero_conta, 'BLOQUEAR')}>
                                                    Bloquear
                                                </ActionButton>
                                                <ActionButton className="encerrar" 
                                                onClick={() => atualziarStatusConta(conta.numero_conta, 'ENCERRAR')}>
                                                    Encerrar
                                                </ActionButton>
                                            </>
                                        )}
                                        {contas.status === 'BLOQUEADA' && (
                                            <ActionButton className="desbloquear" onClick={() => atualziarStatusConta(conta.numero_conta, 'DESBLOQUEAR')}>
                                                Desbloquear
                                            </ActionButton>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </ManagementTable>
                )}
            </Layout>
        </ProtectedRoute>
    );
}