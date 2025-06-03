import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useApi } from "@/frontend/hooks/useApi";
import Layout from "../../../components/shared/Layout";
import SaqueForm from "../../cliente/SaqueForm";

export default function SaqueForm() {
    const router = useRouter();
    const { id_conta } = router.query;
    const [conta, setConta] = useState(null);
    const api = useApi();

    // Carrega os dados da conta se não tiver id
    useEffect(() => {
        if(!id_conta) {
            const carregarContaprincipal = async () => {
                const response = await api.get('/cliente/contas');
                if(response.data.length > 0) {
                    setConta(response.data[0]);
                }
            };
            carregarContaprincipal();
        }
    }, []);

    const handleSuccess = () => {
        router.push('/cliente/dashboard');
    };

    return (
        <Layout title="Realizar Saque">
            {conta || id_conta ? (
                <SaqueForm contaId={id_conta || conta.id_conta} onSuccess={handleSuccess} />
            ) : (
                <p>Carregando infomações da conta...</p>
            )}
        </Layout>
    );
}