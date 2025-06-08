export function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}



export function formatarData(timestamp, incluirHora = false) {
    const options = incluirHora
        ? { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }
        : { day: '2-digit', month: '2-digit', year: 'numeric' };

    return new Intl.DateTimeFormat('pt-BR', options).format(new Date(timestamp));
}

export function exibirErro(memsagem) {
    alert(`Erro: ${memsagem}`);
}

export function traduzirTipoConta(tipo) {
  const map = {
    'POUPANCA': 'Poupança',
    'CORRENTE': 'Conta Corrente',
    'INVESTIMENTO': 'Investimento'
  };
  return map[tipo] || tipo;
}