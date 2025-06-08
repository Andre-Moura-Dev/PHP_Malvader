import { useState } from "react";
import { useRouter } from "next/router";
import { useApi } from "@/frontend/hooks/useApi";
import Layout from "../../shared/Layout";
import ProtectedRoute from "../../shared/ProtectedRoute";
import { toast } from "react-toastify";
import styled from "styled-components";

export default function CadastrarFuncionarioPage() {
    const router = useRouter();
    const api = useApi();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        data_nascimento: '',
        telefone: '',
        codigo_funcionario: '',
        cargo: 'ATENDENTE',
        senha: '',
        confirmar_senha: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if(formData.senha !== formData.confirmar_senha) {
            toast.error('As senhas não coincidem');
            setLoading(false);
            return;
        }

        try {
            await api.post('/funcionario/cadastrar', {
                nome: formData.nome,
                cpf: formData.cpf,
                data_nascimento: formData.data_nascimento,
                telefone: formData.telefone,
                codigo_funcionario: formData.codigo_funcionario,
                cargo: formData.cargo,
                senha: formData.senha
            });

            toast.success('Funcionário cadastrado com sucesso!');
            router.push('/funcionario/dashboard');
        } catch (error) {
            toast.error(error.error || 'Erro ao cadastrar funcionário');
        } finally {
            setLoading(false);
        }
    };

    const formatarCPF = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    };

    const formatarTelefone = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1'); 
    };

    return (
        <ProtectedRoute requiredRole="GERENTE"> {/* Apenas gerentes podem acessar */}
            <Layout title="Cadastrar Funcionário">
                <FormContainer>
                    <FormTitle>Cadastrar Novo Funcionário</FormTitle>

                    <form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label>Nome Completo</Label>
                            <Input type="text" 
                                value={formData.nome} 
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })} 
                                required 
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>CPF</Label>
                            <Input type="text" 
                                value={formData.cpf} 
                                onChange={(e) => setFormData({ ...formData, cpf: formatarCPF(e.target.value) })} 
                                maxLength={14} 
                                placeholder="000.000.000-00" 
                                required 
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Data de Nascimento</Label>
                            <Input type="date" 
                                value={formData.data_nascimento} 
                                onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })} 
                                maxLength={15} 
                                placeholder="(00) 00000-0000" 
                                required 
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Código do Funcionário</Label>
                            <Input type="text" 
                                value={formData.codigo_funcionario} 
                                onChange={(e) => setFormData({ ...formData, codigo_funcionario: e.target.value })} 
                                required 
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Cargo</Label>
                            <Select value={formData.cargo} 
                            onChange={(e) => setFormData({ ...formData, cargo: e.target.value })} 
                            required
                            >
                                <option value="ESTAGIARIO">Estagiário</option>
                                <option value="ATENDENTE">Atendente</option>
                                <option value="GERENTE">Gerente</option>
                            </Select>
                        </FormGroup>

                        <FormGroup>
                            <Label>Senha</Label>
                            <Input type="password" 
                                value={formData.senha} 
                                onChange={(e) => setFormData({ ...formData, senha: e.target.value })} 
                                maxLength={6} 
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Confirmar Senha</Label>
                            <Input type="password" 
                                value={formData.confirmar_senha} 
                                onChange={(e) => setFormData({ ...formData, confirmar_senha: e.target.value })} 
                                minLength={6} 
                                required 
                            />
                        </FormGroup>

                        <ButtonGroup>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Cadastrando...' : 'Cadastrar Funcionário'}
                            </Button>
                            <Button type="button" onClick={() => router.push('/funcionario/dashboard')} style={{ backgroundColor: '#e53e3e' }}>
                                Cancelar
                            </Button>
                        </ButtonGroup>
                    </form>
                </FormContainer>
            </Layout>
        </ProtectedRoute>
    );
}