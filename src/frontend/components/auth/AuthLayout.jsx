import styled from 'styled-components';
import Head from 'next/head';
import Link from 'next/link';

const AuthContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f0f2f5;
`;

const AuthCard = styled.div`
  width: 100%;
  max-width: 400px;
  margin: auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.h1`
  color: #2a4365;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
`;

const FormTitle = styled.h2`
  color: #2d3748;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.5rem;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const Button = styled.button`
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

const FooterLinks = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: #718096;

  a {
    color: #4299e1;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function AuthLayout({ title, children }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Banco Malvader - Sistema Bancário" />
      </Head>
      
      <AuthContainer>
        <AuthCard>
          <Logo>Banco Malvader</Logo>
          {children}
          <FooterLinks>
            <Link href="/auth/login">Voltar para login</Link>
          </FooterLinks>
        </AuthCard>
      </AuthContainer>
    </>
  );
}