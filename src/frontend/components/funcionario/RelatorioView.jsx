import { useState, useEffect } from "react";
import { useApi } from "@/frontend/hooks/useApi";

export default function RelatorioView() {
    const [relatorios, setRelatorios] = useState([]);
    const [loading, setLoading] = useState(false);
    const api = useApi();

    useEffect(() => {
        const carregarRelatorios = async() => {
            setLoading(true);
            try {
                const response = await api.get('/relatorios');
                setRelatorios(response.data);
            } catch (error) {
                console.error('Erro ao carregar relatórios:', error);
            } finally {
                setLoading(false);
            }
        };

        carregarRelatorios();
    }, []);

    const gerarRelatorio = async (tipo) => {
        try {
            await api.get(`/relatorio/${tipo}`);
            toast.success('Relatório gerado com sucesso!');
            // Atualizar Lista de relatórios
            const response = await api.get('/relatorios');
            setRelatorios(response.data);
        } catch (error) {
            toast.error('Erro ao gerar relatório');
        }
    };

    return (
        <div className="relatorio-container">
            <div className="relatorio-actions">
                <button onClick={() => gerarRelatorio('contas')}>
                    Gerar Relatório de Contas
                </button>
                <button onClick={() => gerarRelatorio('transacoes')}>
                    Gerar Relatório de Transações
                </button>
            </div>

            {loading ? (
                <p>Carregando relatórios...</p>
            ) : (
                <div className="relatorio-list">
                    {relatorios.map((relatorio) => (
                        <div key={relatorio.id_relatorio} className="relatorio-item">
                            <h4>{relatorio.tipo_relatorio}</h4>
                            <p>Gerado em: {new Date(relatorio.data_geracao).toLocaleString()}</p>
                            <a href={`data:application/json;charset=utf-8, ${encodeURIComponent(relatorio.conteudo)}`} 
                            download={`relatorio-${relatorio.id_relatorio}.json`}>
                                Baixar Relatório
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}