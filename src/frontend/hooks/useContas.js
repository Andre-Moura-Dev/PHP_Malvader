import { useState, useEffect } from "react";
import { useApi } from './useApi';
import { useAuth } from './UseAuth';
import { toast } from 'react-toastify';

export default function useContas() {
    const api = useApi();
    const { user } = useAuth();
    const [contas, setContas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Carrega todas as contas do cliente
    const carregarContas = async () => {
        setLoading(true);

        try {
            const response = await api.get('/cliente/contas');
            setContas(response.data);
        } catch (err) {
            setError(err.error || 'Erro ao carregar contas');
            toast.error('Falha ao carregar contas');
        } finally {
            setLoading(false);
        }
    };

    // Realiza um depósito
    const realizarDeposito = async (contaId, valor) => {
        try {
            await api.post('/cliente/deposito', {id_conta: contaId, valor});
            await carregarContas(); // Atualiza a lista de contas
            toast.success('Depósito realizado com sucesso!');
            return true;
        } catch (error) {
            toast.error(error.error || 'Erro ao realizar depósito');
        }
    };

    // Realiza um saque
    const realizarSaque = async (contaId, valor, senha) => {
        try {
            await api.post('/cliente/saque', {
                id_conta: contaId,
                valor,
                senha
            });
            await carregarContas();
            toast.success('Saque realizado com sucesso!');
            return true;
        } catch (error) {
            toast.error(error.error || 'Erro ao realizar saque');
            return false;
        }
    };

    // Realiza uma transferência
    const realizarTransferencia = async(contaOrigem, contaDestino, valor, senha) => {
        try {
            await api.post('/cliente/transferencia', {
                id_conta_origem: contaOrigem,
                numero_conta_destino: contaDestino,
                valor,
                senha
            });
            await carregarContas();
            toast.success('Transferência realizada com sucesso!');
            return true;
        } catch (error) {
            toast.error(error.error || 'Erro ao realizar transferência');
            return false;
        }
    };

    // Carrega contas automaticamente quando o hook é usado
    useEffect(() => {
        if(user) {
            carregarContas();
        }
    }, [user]);

    return {
        contas,
        loading,
        error,
        carregarContas,
        realizarDeposito,
        realizarSaque,
        realizarTransferencia
    };
}