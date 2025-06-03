import styled from "styled-components";
import { useRouter } from "next/router";
import { useAuth } from "@/frontend/contexts/AuthContext";
import Header from "./Header";
import Sidebar from "./Sidebar";

const LayoutContainer = styled.div `
    display: flex;
    min-height: 100vh;
    background-color: #f5f7fa;
`;

const MainContent = styled.div `
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const ContentArea = styled.main `
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
    background-color: #fff;
    margin: 1rem;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
        margin: 0;
        border-radius: 0;
    }
`;

const PageTitle = styled.h1 `
    color: #2a4365;
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 0.5rem;
`;

export default function Layout({ title, children }) {
    const router = useRouter();
    const { logout, isFuncionario } = useAuth();

    // Itens do menu de acordo com o tipo de usuário
    const menuItems = isFuncionario()
        ? [
            {label: 'Dashboard', path: '/funcionario/dashboard', icon: '📊'},
            {label: 'Abrir Conta', path: '/funcionario/abrir-conta', icon: '➕'},
            {label: 'Clientes', path: '/funcionario/clientes', icon: '👥'},
            {label: 'Relatórios', path: '/funcionario/relatorios', icon: '📈'}
          ]
        : [
            {label: 'Dashboard', path: '/cliente/dashboard', icon: '🏠'},
            {label: 'Depósito', path: '/cliente/deposito', icon: '📥'},
            {label: 'Saque', path: '/cliente/saque', icon: '📥'},
            {label: 'Transferência', path: '/cliente/transferencia', icon: '🔄'},
            {label: 'Extrato', path: '/cliente/extrato', icon: '📋'}
          ];
    
    return (
        <LayoutContainer>
            <Sidebar items={menuItems} activePath={router.pathname} />

            <MainContent>
                <Header title={title} 
                onLogout={logout} 
                userType={isFuncionario() ? 'Funcionário' : 'Cliente'} />

                <ContentArea>
                    <PageTitle>{title}</PageTitle>
                    {children}
                </ContentArea>
            </MainContent>
        </LayoutContainer>
    );
}