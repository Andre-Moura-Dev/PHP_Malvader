import { useState } from "react";
import { useApi } from "@/frontend/hooks/useApi";
import { toast } from 'react-toastify';

export default function DepositoForm({ contaId, onSuccess }) {
    const [valor, setValor] = useState('');
    const [loading, setLoading] = useState(false);
    const api = useApi();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/cliente/deposito', {
                id_conta: contaId,
                valor: parseFloat(valor)
            });
            toast.success('Depósito realizado com sucesso!');
            onSuccess();
        } catch (error) {
            toast.error(error.error || 'Erro ao realizar depósito');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Realizar Depósito</h3>
            <div className="form-group">
                <label>Valor: R$</label>
                <Input type="number" 
                step="0.01" 
                min="0.01" 
                value={valor} 
                onChange={(e) =>setValor(e.target.value)} 
                placeholder="0,00" 
                required />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Processando...' : 'Depositar'}
            </button>
        </form>
    );
}