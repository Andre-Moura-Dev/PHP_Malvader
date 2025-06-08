import { useState, useEffect, use } from "react";
import { useApi } from "@/frontend/hooks/useApi";
import { toast } from "react-toastify";
import styled from "styled-components";

const FormContainer = styled.div `
    max-width: 600px;
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
    transition: border-color 0.2s;

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

export default function ContaForm({ contaData, onSuccess, onCancel }) {
    const api = useApi();
    const [clientes, setClientes] = useState([]);
    const [formData, setFormData] = useState({
        id_cliente: '',
        tipo_conta: 'CORRENTE',
        id_agencia: '001',
        limite: 1000,
        taxa_rendimento: 0.5,
        perfil_risco: 'MEDIO'
    });

    // Carrega clientes e inicializa formData
    useEffect(() => {
        const carregarClientes = async () => {
            try {
                const response = await api.get('/funcionario/clientes');
                setClientes(response.data);

                if(contaData) {
                    // Edição
                    setFormData({
                        id_cliente: contaData.id_cliente,
                        tipo_conta: contaData.tipo_conta,
                        id_agencia: contaData.id_agencia,
                        ...(contaData.tipo_conta === 'CORRENTE' && {limite: contaData.limite}),
                        ...(contaData.tipo_conta === 'POUPANCA' && {taxa_rendimento: contaData.taxa_rendimento}),
                        ...(contaData.tipo_conta === 'INVESTIMENTO' && {perfil_risco: contaData.perfil_risco})
                    });
                } else  if (response.data.length > 0) {
                    // Criação
                    setFormData(prev => ({ ...prev, id_cliente: response.data[0].id_cliente }));
                }
            } catch (error) {
                toast.error('Erro ao carregar clientes');
            }
        };

        carregarClientes();
    }, [contaData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dadosEspecificos = {
            ...(formData.tipo_conta === 'CORRENTE' && {
                limite: parseFloat(formData.limite),
                taxa_manutencao: 10.00
            }),
            ...(formData.tipo_conta === 'POUPANCA' && {
                taxa_rendimento: parseFloat(formData.taxa_rendimento)
            }),
            ...(formData.tipo_conta === 'INVESTIMENTO' && {
                perfil_risco: formData.perfil_risco,
                valor_minimo: 1000
            })
        };

        try {
            if(contaData) {
                // Atualizar conta existente
                await api.put(`/funcionario/conta/${contaData.numero_conta}`, {
                    ...formData,
                    dadosEspecificos
                });
                toast.success('Conta atualizada com sucesso!');
            } else {
                // Criar nova conta
                await api.post('/funcionario/conta/abrir', {
                    ...formData,
                    dadosEspecificos
                });
                toast.success('Conta criada com sucesso!');
            }
            onSuccess();
        } catch (error) {
            toast.error(error.error || 'Erro ao salvar conta');
        }
    };

    const renderCamposEspecificos = () => {
        switch (formData.tipo_conta) {
            case 'CORRENTE':
                return (
                    <FormGroup>
                        <Label>Limite da Conta: R$</Label>
                        <Input type="number" 
                            step="100" 
                            min="0" 
                            value={formData.limite} 
                            onChange={(e) => setFormData({ ...formData, limite: e.target.value })} 
                            required 
                        />
                    </FormGroup>  
                );
            case 'POUNPANCA':
                return (
                    <FormGroup>
                        <Label>Taxa de Rendimento: %ao mês</Label>
                        <Input type="number" 
                            step="0.1" 
                            min="0.1" 
                            max="5" 
                            value={formData.taxa_rendimento} 
                            onChange={(e) => setFormData({ ...formData, taxa_rendimento: e.target.value })}
                            required 
                        />
                    </FormGroup>
                );
            case 'INVESTIMENTO':
                return (
                    <FormGroup>
                        <Label>Pefil de Risco</Label>
                        <Select value={formData.perfil_risco} 
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
        <FormContainer>
            <FormTitle>{contaData ? 'Editar Conta' : 'Abrir Nova Conta'}</FormTitle>

            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>Cliente</Label>
                    <Select value={formData.id_cliente} 
                        onChange={(e) => setFormData({ ...formData, id_cliente: e.target.value })} 
                        required 
                        disabled={!!contaData}
                    >
                        {clientes.map((cliente) => {
                            <option key={cliente.id_cliente} value={cliente.id_cliente}>
                                {cliente.nome} - CPF: {cliente.cpf}
                            </option>
                        })}
                    </Select>
                </FormGroup>
                <FormGroup>
                    <Label>Tipo de Conta</Label>
                    <Select value={formData.tipo_conta} 
                        onChange={(e) => setFormData({ ...formData, tipo_conta: e.target.value })} 
                        required 
                        disabled={!!contaData}
                    >
                        <option value="CORRENTE">Conta Corrente</option>
                        <option value="POUNPANCA">Conta Poupança</option>
                        <option value="INVESTIMENTO">Conta Investimento</option>

                    </Select>
                </FormGroup>
                <FormGroup>
                    <Label>Agência</Label>
                    <Input type="text" 
                    value={formData.id_agencia} 
                        onChange={(e) => setFormData({ ...formData, id_agencia: e.target })} 
                        required 
                    />
                </FormGroup>

                {renderCamposEspecificos()}

                <ButtonGroup>
                    <Button type="submit">
                        {contaData ? 'Atualizar Conta' : 'Criar Conta'}
                    </Button>
                    <Button type="button" onClick={onCancel} style={{ backgroundColor: '#e53e3e' }}>
                        Cancelar
                    </Button>
                </ButtonGroup>
            </form>
        </FormContainer>
    )
}