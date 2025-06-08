import { useState } from "react";
import { useApi } from "@/frontend/hooks/useApi";
import { toast } from 'react-toastify';
import styled from "styled-components";

const FormContainer = styled.div `
    max-width: 500px;
    margin: 0 auto;
    padding: 2rem;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h3 `
    color: #2a4365;
    margin-bottom: 1.5rem;
    text-align: center;
`;

const FormGroup = styled.div `
    margin-bottom: 1.5rem;
`;

const Label = styled.label `
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #4a5568;
`;

const Input = styled.input `
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color: 0.2s;

    &:focus {
        outline: none;
        border-color: #4299e1;
    }
`;

const Button = styled.button `
    width: 100%;
    padding: 0.75rem;
    background-color: #2a4365;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color: 0.2s;

    &:hover {
        background-color: #2c5282;
    }

    &:disabled {
        background-color: #cbd5e0;
        cursor: not-allowed;
    }
`;

const ErrorMessage = styled.p `
    color: #f56565;
    margin-top: 0.5rem;
`;

export default function SaqueForm({ contaId, onSuccess }) {
    const [valor, setValor] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const api = useApi();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!valor || parseFloat(valor) <= 0) {
            setError('Valor inválido');
            setLoading(false);
            return;
        }

        try {
            await api.post('/cliente/saque', {
                id_conta: contaId,
                valor: parseFloat(valor),
                senha
            });
            toast.success('Saque realizado com sucesso!');
            onSuccess();
        } catch (err) {
            setError(err.error || 'Erro ao realizar saque. Verifique seu lado e senha.');
            toast.error('Falha ao realizar saque');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormContainer>
            <FormTitle>Realizar Saque</FormTitle>
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <label>Valor: R$</label>
                    <Input type="number" 
                    step="0.01"
                    min="0.01"
                    value={valor} 
                    onChange={(e) => setValor(e.target.value)} 
                    placeholder="Informe o valor" 
                    required />
                </FormGroup>

                <FormGroup>
                    <Label>Senha</Label>
                    <Input type="password" 
                    value={senha} 
                    onChange={(e) => setSenha(e.target.value)} 
                    placeholder="Digite uma senha"  
                    required />
                </FormGroup>

                {error && <ErrorMessage>{error}</ErrorMessage>}

                <Button type="submit" disabled={loading}>
                    {loading ? 'Processando...' : 'Sacar'}
                </Button>
            </form>
        </FormContainer>
    );
}