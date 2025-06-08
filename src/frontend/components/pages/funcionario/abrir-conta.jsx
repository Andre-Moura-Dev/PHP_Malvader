import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useApi } from "@/frontend/hooks/useApi";
import { useAuth } from "@/frontend/contexts/AuthContext";
import Layout from "../../shared/Layout";
import ProtectedRoute from "../../shared/ProtectedRoute";
import { toast } from "react-toastify";
import styled from "styled-components";

const FormContainer = styled.div `
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2 `
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

const Select = styled.select `
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    font-size: 1rem;
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
    transition: background-color 0.2s;

    &:hover {
        background-color: #2c5282;
    }

    &:disabled {
        background-color: #cbd5e0;
        cursor: not-allowed;
    }
`;

const ButtonGroup = styled.div `
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
`;

export default function AbrirContaPage() {
    const router = useRouter();
    const api = useApi();
    const { isFuncionario } = useAuth();
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id_cliente: '',
        tipo_conta: 'CORRENTE',
        id_agencia: '001', // Código padrão da agência
        limite: 1000,
        taxa_rendimento: 0.5,
        pefil_risco: 'MEDIO'
    });

    // Carrega lista de clientes
    useEffect(() => {
        const carregarClientes = async () => {
            try {
                const response = await api.get('/funcionario/clientes');
                setClientes(response.data);
                if(response.data.length > 0) {
                    setFormData(prev => ({ ...prev, id_cliente: response.data[0].id_cliente }));
                }
            } catch (error) {
                toast.error('Erro ao carregar clientes');
            }
        };

        carregarClientes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dadosEspecificos = {
                ...(formData.tipo_conta === 'CORRENTE' && {
                    limite: parseFloat(formData.limite),
                    taxa_manutencao: 10.00
                }),
                ...(formData.tipo_conta === 'POUPANCA' && {
                    taxa_rendimento: parseFloat(formData.taxa_rendimento)
                }),
                ...(formData.tipo_conta === 'INVESTIMENTO' && {
                    perfil_risco: formData.pefil_risco,
                    valor_minimo: 1000
                })
            };

            await api.post('/funcionario/conta/abrir', {
                tipo: formData.tipo_conta,
                id_agencia: formData.id_agencia,
                id_cliente: formData.id_cliente,
                dadosEspecificos
            });

            toast.success('Conta aberta com sucesso!');
            router.push('/funcionario/dashboard');
        } catch (error) {
            toast.error(error.error || 'Erro ao abrir conta');
        } finally {
            setLoading(false);
        }
    };

    const renderCamposEspecificos = () => {
        switch (formData.tipo_conta) {
            case 'CORRENTE':
                return (
                    <FormGroup>
                        <Label>Limite da conta: R$</Label>
                        <Input type="number" 
                        step="100" 
                        min="0" 
                        value={formData.limite} 
                        onChange={(e) => setFormData({ ...formData, limite: e.target.value })} 
                        required 
                        />
                    </FormGroup>
                );
            case 'POUPANCA':
                return (
                    <FormGroup>
                        <Label>Taxa de Rendimento: % ao mês</Label>
                        <Input type="number" 
                        step="0.1" 
                        min="0.1" 
                        max="5" 
                        value={formData.taxa_rendimento} 
                        onChange={(e) => setFormData({ ...formData, taxa_rendimento: e.target.value })} 
                        required />
                    </FormGroup>
                );
            case 'INVESTIMENTO':
                return (
                    <FormGroup>
                        <Label>Perfil de Risco</Label>
                        <Select value={formData.pefil_risco} 
                        onChange={(e) => setFormData({ ...formData, perfil_risco: e.target.value })} 
                        required
                        >
                            <option value="BAIXO">Baixo</option>
                            <option value="MEDIO">Médio</option>
                            <option value="ALTO">Alto</option>
                        </Select>
                    </FormGroup>
                );
            default:
                return null;
        }
    };

    return (
        <ProtectedRoute requiredRole="FUNCIONARIO">
            <Layout title="Abrir Nova Conta">
                <FormContainer>
                    <FormTitle>Abrir Nova Conta Bancária</FormTitle>

                    <form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label>Cliente</Label>
                            <Select value={formData.id_cliente} 
                                onChange={(e) => setFormData({ ...formData, id_cliente: e.target.value })} 
                                required 
                                >

                                {clientes.map((cliente) => (
                                    <option key={cliente.id_cliente} value={cliente.id_cliente}>
                                        {cliente.nome} - CPF: {cliente.cpf}
                                    </option>
                                ))}
                            </Select>
                        </FormGroup>

                        <FormGroup>
                            <Label>Tipo de Conta</Label>
                            <Select value={formData.tipo_conta} 
                                onChange={(e) => setFormData({ ...formData, tipo_conta: e.target.value })} 
                                required>
                                
                                <option value="CORRENTE">Conta Corrente</option>
                                <option value="POUPANCA">Conta Poupança</option>
                                <option value="INVESTIMENTO">Conta Investimento</option>
                            </Select>
                        </FormGroup>

                        <FormGroup>
                            <Label>Agência</Label>
                            <Input type="text" 
                                value={formData.id_agencia} 
                                onChange={(e) => setFormData({ ...formData, id_agencia: e.target.value })} 
                                required 
                            />
                        </FormGroup>

                        {renderCamposEspecificos()}

                        <ButtonGroup>
                            <Button type="submit" disabled={loading} onClick={() => router.push('/funcionario/dashboard')} style={{backgroundColor: '#e53e3e'}}>
                                Cancelar
                            </Button>
                        </ButtonGroup>
                    </form>
                </FormContainer>
            </Layout>
        </ProtectedRoute>
    );
}