import Link from "next/link";

export default function ContaCard({ conta }) {
    const getTipoConta = () => {
        switch(conta.tipo_conta) {
            case 'POUNPANCA': return 'Poupanca';
            case 'CORRENTE': return 'Corrente';
            case 'INVESTIMENTO': return 'Investimento';
            default: return conta.tipo_conta;
        }
    };

    return (
        <div className="conta-card">
            <h3>{getTipoConta()}</h3>
            <p>Agencia: {conta.codigo_agencia}</p>
            <p>Conta: {conta.numero_conta}</p>
            <p className="saldo">Saldo: R$ {conta.saldo.toFixed(2)}</p>
            <div className="acoes">
                <Link href={`/cliente/deposito?id_conta=${conta.id_conta}`}>
                    <button>Depositar</button>
                </Link>
                <Link href={`/cliente/saque?id_conta=${conta.id_conta}`}>
                    <button>Sacar</button>
                </Link>
                <Link href={`/cliente/transferencia?id_conta=${conta.id_conta}`}>
                    <button>Transferir</button>
                </Link>
            </div>
        </div>
    ); 
}