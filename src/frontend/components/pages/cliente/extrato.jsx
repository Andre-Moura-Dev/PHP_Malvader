import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { useContas } from '@/frontend/hooks/useContas';
import Layout from "../../shared/Layout";
import ProtectedRoute from "../../shared/ProtectedRoute";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

export default function ExtratoPage() {
    const router = useRouter();
    const { id_conta } = router.query;
    const { user } = useAuth();
    const { contas, extratoPeriodo } = useContas();

    const [contaSelecionada, setContaSelecionada] = useState(null);
    const [extrato, setExtrato] = useState([]);
    const [loading, setLoading] = useState(false);
    const [periodo, setPeriodo] = useState({
        inicio: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        fim: new Date()
    });

    // Carrega a conta selecionada ou a primeira conta do cliente
    useEffect(() => {
        if(contas.length > 0) {
            const conta = id_conta
                ? contas.find(c => c.id_conta === parseInt(id_conta))
                : contas[0];
            setContaSelecionada(conta);
        }
    }, [contas, id_conta]);

    // Busca o extrato quando muda o período ou conta
    useEffect(() => {
        if(contaSelecionada) {
            buscarExtrato();
        }
    }, [contaSelecionada, periodo]);

    const buscarExtrato = async () => {
        try {
            const data = await extratoPeriodo (
                contaSelecionada.id_conta,
                periodo.inicio.toISOString().split('T')[0],
                periodo.fim.toISOString().split('T')[0]
            );
            setExtrato(data);
        } catch (error) {
            console.error('Erro ao buscar extrato:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatarData = (dataString) => {
        return new Date(dataString).toLocaleDateString('pt-BR');

    };

    const formatarValor = (valor) => {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    return (
        <ProtectedRoute requiredRole="CLIENTE">
            <Layout title="Extrato Bancário">
                <div className="extrato-container">
                    <h1>Extrato Bancário</h1>

                    {/* Seletor de Conta */}
                    <div className="filtros">
                        <select value={contaSelecionada?.id_conta || ''} onChange={(e) => {
                            const conta = contas.find(c => c.id_conta === parseInt(e.target.value));

                            setContaSelecionada(conta);
                        }} 
                        disabled={loading}
                        >
                            {contas.map(conta => (
                                <option key={conta.id_conta} value={conta.id_conta}>
                                    {conta.tipo_conta} - {conta.numero_conta}
                                </option>
                            ))}
                        </select>

                        {/* Seletor de Período */}
                        <div className="perido-selector">
                            <DatePicker selected={periodo.inicio} 
                            onChange={(date) => setPeriodo({...periodo, inicio: date})} 
                            selectsStart startDate={periodo.inicio} 
                            endDate={periodo.fim} 
                            dateFormat="dd/MM/yyyy" 
                            className="date-input" 
                            />
                            <span> até </span>
                            <DatePicker selected={periodo.fim} 
                            onChange={(date) => setPeriodo({...periodo, fim: date})} 
                            selectsEnd 
                            startDate={periodo.inicio} 
                            endDate={periodo.fim} 
                            minDate={periodo.inicio} 
                            dateFormat="dd/MM/yyyy" 
                            className="date-input" 
                            />
                            <button onClick={buscarExtrato} disabled={loading}>
                                {loading ? 'Atualizando...' : 'Atualizar'}
                            </button>
                        </div>
                    </div>

                    {/* Listagem do Exrato */}
                    <div className="extrato-list">
                            {loading ? (
                                <p>Carregando extrato...</p>
                            ) : extrato.length === 0 ? (
                                <p>Nenhuma transação no período selecionado</p>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Data</th>
                                            <th>Descrição</th>
                                            <th>Tipo</th>
                                            <th>Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {extrato.map((transacao) => (
                                            <tr key={transacao.id_transacao}>
                                                <td>{formatarData(transacao.data_hora)}</td>
                                                <td>{transacao.descricao || '-'}</td>
                                                <td>
                                                    <span className={`tipo-${transacao.tipo_transacao.toLowerCase()}`}>
                                                        {transacao.tipo_transacao}
                                                    </span>
                                                </td>
                                                <td className={transacao.tipo_transacao === 'DEPOSITO' ? 'positivo' : 'negativo'}>
                                                    {formatarValor(transacao.valor)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                    </div>

                    {/* Resumo */}
                    {extrato.length > 0 && (
                        <div className="resumo">
                            <p>
                                Saldo no período: {formatarValor(
                                    extrato.reduce((total, t) => {
                                        return t.tipo_transacao === 'DEPOSITO'
                                            ? total + t.valor
                                            : total - t.valor;
                                    }, 0)
                                )}
                            </p>
                        </div>
                    )}
                </div>
            </Layout>
        </ProtectedRoute>
    );
}