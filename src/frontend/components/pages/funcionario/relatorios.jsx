import { useState, useEffect } from "react";
import { useApi } from "@/frontend/hooks/useApi";
import { useAuth } from "@/frontend/contexts/AuthContext";
import Layout from "../../shared/Layout";
import ProtectedRoute from "../../shared/ProtectedRoute";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.module.css';
import styled from "styled-components";

const ReportContainer = styled.div `
    max-width: 1200px;
    margin: 2rem auto;
    padding: 2rem;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ReportHeader = styled.div `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
`;

const ReportTitle = styled.h2 `
    color: #2a4365;
`;

const ReportFilters = styled.div `
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
`;

const ReportButton = styled.button `
    padding: 0.5rem 1rem;
    background-color: #2a4365;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #2c5282;
    }

    &:disabled {
        background-color: #cbd5e0;
    }
`;

const ReportTable = styled.table `
    width: 100%;
    border-collapse: collapse;
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

const DownloadButton = styled.a `
    color: #4299e1;
    text-decoration: none;
    font-weight: 500;

    &:hover {
        text-decoration: underline;
    }
`;

export default function RelatoriosPage() {
    const api = useApi();
    const [loading, setLoading] = useState(false);
    const [relatorios, setRelatorios] = useState([]);
    const [filtros, setFiltros] = useState({
        tipo: 'CONTAS',
        dataInicio: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        dataFim: new Date()
    });

    const carregarRelatorios = async () => {
        setLoading(true);

        try {
            const response = await api.get('/relatorios');
            setRelatorios(response.data);
        } catch (error) {
            toast.error('Erro ao carregar relatórios');
        } finally {
            setLoading(false);
        }
    };

    const gerarRelatorio = async () => {
        setLoading(true);

        try {
            await api.post('/relatorio/gerar', {
                tipo_relatorio: filtros.tipo,
                data_inicio: filtros.dataInicio.toISOString().split('T')[0],
                data_fim: filtros.dataFim.toISOString().split('T')[0]
            });
            toast.success('Relatório gerado com sucesso!');
            await carregarRelatorios();
        } catch (error) {
            toast.error(error.error || 'Erro ao gerar relatório');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarRelatorios();
    }, []);

    const formatarData = (dataString) => {
        return new Date(dataString).toLocaleDateString('pt-BR');
    };

    return (
        <ProtectedRoute requiredRole="FUNCIONARIO">
            <Layout title="Relatórios">
                <ReportContainer>
                    <ReportHeader>
                        <ReportTitle>Relatórios Bancários</ReportTitle>

                        <ReportFilters>
                            <select value={filtros.tipo} 
                                onChange={(e) => setFiltros({...filtros, tipo: e.target.value})} 
                                disabled={loading}
                                >

                                <option value="CONTAS">Contas</option>
                                <option value="TRANSAÇÕES">Transações</option>
                                <option value="CLIENTES">Clientes</option>

                            </select>

                            <DatePicker
                                selected={filtros.dataInicio}
                                onChange={(date) => setFiltros({...filtros, dataInicio: date})}
                                selectsStart
                                startDate={filtros.dataInicio}
                                endDate={filtros.dataFim}
                                dateFormat="dd/MM/yyyy"
                            />

                            <span>até</span>

                            <DatePicker selected={filtros.dataFim} 
                                onChange={(date) => setFiltros({...filtros, dataFim: date})} 
                                selectsEnd startDate={filtros.dataInicio} 
                                endDate={filtros.dataFim} 
                                minDate={filtros.dataInicio} 
                                dateFormat="dd/MM/yyyy" 
                            />


                            <ReportButton 
                                onClick={gerarRelatorio} 
                                disabled={loading}
                            >

                                {loading ? 'Gerando...' : 'Gerar Relatório'}
                            </ReportButton>
                        </ReportFilters>
                    </ReportHeader>

                    {loading ? (
                        <p>Carregando relatórios...</p>
                    ) : (
                        <ReportTable>
                            <thead>
                                <tr>
                                    <th>Tipo</th>
                                    <th>Período</th>
                                    <th>Data de Geração</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {relatorios.map((relatorio) => (
                                    <tr key={relatorio.id_relatorio}>
                                        <td>{relatorio.tipo_relatorio}</td>
                                        <td>
                                            {relatorio.data_inicio && relatorio.data_fim ? `${formatarData(relatorio.data_inicio)} - ${formatarData(relatorio.data_fim)}` 
                                            : 'Completo'}
                                        </td>
                                        <td>{formatarData(relatorio.data_geracao)}</td>
                                        <td>
                                            <DownloadButton href={`data:application/json;charset=utf-8, ${encodeURIComponent(relatorio.conteudo)}`} download={`relatorio_${relatorio.tipo_relatorio}_${relatorio.id_relatorio}.json`}>
                                                Baixar
                                            </DownloadButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </ReportTable>
                    )}
                </ReportContainer>
            </Layout>
        </ProtectedRoute>
    )
}