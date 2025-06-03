import styled from "styled-components";

const HeaderContainer = styled.header `
    background-color: #2a4365;
    color: white;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2 `
    margin: 0;
    font-size: 1.5rem;
`;

const UserArea = styled.div `
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const UserBadge = styled.span `
    background-color: #4299e1;
    padding: 0.5rem 1 rem;
    border-radius: 20px;
    font-size: 0.875rem;
`;

const LogoutButton = styled.button `
    background: none;
    border: 1px solid white;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
`;

export default function Header({ title, onLogout, userType }) {
    return (
        <HeaderContainer>
            <Title>{title}</Title>
            <UserArea>
                <UserBadge>{userType}</UserBadge>
                <LogoutButton onClick={onLogout}>Sair</LogoutButton>
            </UserArea>
        </HeaderContainer>
    );
}