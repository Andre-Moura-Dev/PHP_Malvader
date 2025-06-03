import styled from "styled-components";
import Link from "next/link";
import { useAuth } from "@/frontend/contexts/AuthContext";

const SidebarContainer = styled.aside `
    width: 250px;
    background-color: #1a365d;
    color: white;
    padding: 1rem 0;
    transition: width 0.3s;

    @media (max-width: 768px) {
        width: 70px;
    }
`;

const MenuItem = styled.div `
    padding: 0.75rem 1.5rem;
    margin: 0.25rem 0;
    background-color: ${props => props.$active ? '#2c5282' : 'transparent'};
    cursor: pointer;
    transition: background-color: 0.2s;
    display: flex;
    align-items: center;
    gap: 1rem;

    &:hover {
        background-color: #2b6cb0;
    }

    @media (max-width: 768px) {
        justify-content: center;
        span {
            display: none;
        }
    }
`;

const MenuIcon = styled.span `
    font-size: 1.2rem;
`;

export default function Sidebar({ items, activePath }) {
    const { user } = useAuth();

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
        <SidebarContainer>
            <div style={{ padding: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold' }}>Olá, {user?.nome.split(' ')[0]}</div>
            </div>

            <Sidebar items={menuItems} activePath={router.pathname} /> 

            {items.map((item) => (
                <Link href={item.path} key={item.path} passHref>
                    <MenuItem $active={activePath.startsWith(item.path)}>
                        <MenuIcon>{item.icon}</MenuIcon>
                        <span>{item.label}</span>
                    </MenuItem>
                </Link>
            ))}
        </SidebarContainer>
    );
}