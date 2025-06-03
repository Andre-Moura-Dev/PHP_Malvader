import { useState, useEffect } from "react";
import { useApi } from "@/frontend/hooks/useApi";
import { toast } from 'react-toastify';
import styled from "styled-components";

const FormContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h3`
  color: #2a4365;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #4a5568;
`;

const Input = styled.input`
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

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
`;

const Button = styled.button`
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

const ErrorMessage = styled.p`
  color: #f56565;
  margin-top: 0.5rem;
`;

export default function TransferenciaForm({ contasCliente, onSuccess }) {
  const [contasDestino, setContasDestino] = useState([]);
  const [formData, setFormData] = useState({
    contaOrigem: '',
    contaDestino: '',
    valor: '',
    senha: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const api = useApi();

  useEffect(() => {
    if(contasCliente.length > 0) {
        setFormData(prev => ({
          ...prev,
          contaOrigem: contasCliente[0].id_conta
        }));
    }
  }, [contasCliente]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if(!formData.valor || parseFloat(formData.valor) <= 0) {
      setError('Valor inválido');
      setLoading(false);
      return;
    }

    try {
      await api.post('/cliente/transferencia', {
        id_conta_origem: formData.contaOrigem,
        numero_conta_destino: formData.contaDestino,
        valor: parseFloat(formData.valor),
        senha: formData.senha
      });
      toast.success('Transferência realizada com sucesso!');
      onSuccess();
    } catch (err) {
      setError(err.error || 'Erro ao realizar transferência');
      toast.error('Falha na transferência');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchAccount = async (numeroConta) => {
    if(numeroConta.length < 5) return;

    try {
      const response = await api.get(`/conta/buscar?numero=${numeroConta}`);
      setContasDestino(response.data);
    } catch (error) {
      setContasDestino([]);
    }
  };

  return (
    <FormContainer>
      <FormTitle>Realizar Transferência</FormTitle>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <label>Conta de Origem</label>
          <Select value={formData.contaOrigem}
            onChange={(e) => setFormData({...formData, contaOrigem: e.target.value})}
            required 
          >
            {contasCliente.map((conta) => (
            <option key={conta.id_conta} value={conta.id_conta}>
              {conta.tipo_conta} - {conta.numero_conta} (Saldo: R$ {conta.saldo.toFixed(2)})
            </option>
          ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <label>Conta de Destino</label>
          <Input type="text" value={formData.contaDestino} onChange={(e) => {
            setFormData({...formData, contaDestino: e.target.value});
            handleSearchAccount(e.target.value);
          }} 
          placeholder="Digite o número da conta destino" 
          required
          />
          {contasDestino.length > 0 && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
              <p>Conta encontrada:</p>
              <p><strong>Titular:</strong> {contasDestino[0].cliente}</p>
            </div>
          )}
        </FormGroup>

        <FormGroup>
          <label>Valor: R$</label>
          <Input type="number" 
          step="0.01" 
          min="0.01" 
          value={formData.valor} 
          onChange={(e) => setFormData({...formData, valor: e.target.value})} 
          placeholder="Informe o valor" 
          required /> 
        </FormGroup>

        <FormGroup>
          <label>Senha</label>
          <Input type="password" 
          value={formData.senha} 
          onChange={(e) => setFormData({...formData, senha: e.target.value})} 
          placeholder="Informe a sua senha" 
          required />
        </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button type="submit" disabled={loading}>
            {loading ? 'Processando...' : 'Transferir'}
          </Button>
      </form>
    </FormContainer>
  );
}