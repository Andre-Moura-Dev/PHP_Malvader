import { useState } from "react";
import { useApi } from "@/frontend/hooks/useApi";
import { toast } from 'react-toastify';

export default function FuncionarioForm() {
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        data_nascimento: '',
        telefone: '',
        codigo_funcionario: '',
        cargo: 'ATENDENTE',
        senha: ''
    });
    const [loading, setLoading] = useState(false);
    const api = useApi();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/funcionario/cadastrar', formData);
            toast.success('Funcionário cadastrado com sucesso!');
            setFormData({
                nome: '',
                cpf: '',
                data_nascimento: '',
                telefone: '',
                codigo_funcionario: '',
                cargo: 'ATENDENTE',
                senha: ''
            });
        } catch (error) {
            toast.error(error.error || 'Erro ao cadastrar funcionário');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Cadastrar Novo Funcionário</h3>

            <div className="form-row">
                <div className="form-group">
                    <label>Nome Completo</label>
                    <input type="text" 
                    value={formData.nome} 
                    onChange={(e) => setFormData({...formData, nome: e.target.value})} 
                    required />
                </div>

                <div className="form-group">
                    <label>CPF</label>
                    <input type="text" 
                    value={formData.cpf} 
                    onChange={(e) => setFormData({...formData, cpf: e.target.value.replace(/D/g, '')})} 
                    maxLength={11} 
                    required />
                </div>
            </div>


            <button type="submit" disabled={loading}>
                {loading ? 'Cadastrando...' : 'Cadastrar Funcionário'}
            </button>
        </form>
    );
}