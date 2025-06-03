import { useRouter } from "next/router";
import Layout from "../../shared/Layout";
import DepositoForm from "../../cliente/DepositoForm";

export default function DepositoPage() {
    const router = useRouter();
    const { id_conta } = router.query;

    const handleSuccess = () => {
        router.push('/cliente/dashboard');
    };

    return (
        <Layout title="Depósito">
            <DepositoForm contaId={id_conta} onSuccess={handleSuccess} />
        </Layout>
    );
}