<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Banco Malvader - Documentação</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333;
      margin: 0;
      padding: 0;
    }
    header {
      background-color: #0d47a1;
      color: white;
      padding: 20px;
      text-align: center;
    }
    main {
      padding: 20px;
    }
    section {
      margin-bottom: 30px;
    }
    h2 {
      color: #0d47a1;
    }
    ul {
      list-style-type: disc;
      margin-left: 20px;
    }
    code {
      background-color: #eee;
      padding: 2px 6px;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <header>
    <h1>Documentação do Projeto - Banco Malvader</h1>
    <p>Sistema Bancário Desenvolvido em PHP (Backend) e Next.js (Frontend)</p>
  </header>

  <main>
    <section>
      <h2>Introdução</h2>
      <p>O "Banco Malvader" é uma aplicação bancária completa que simula operações reais de uma instituição financeira. O sistema integra uma interface gráfica moderna (Next.js), backend em PHP e persistência em banco de dados MySQL.</p>
    </section>

    <section>
      <h2>Requisitos Funcionais</h2>
      <ul>
        <li><strong>RF1 - Autenticação:</strong> Login seguro com senha e OTP gerado pelo sistema.</li>
        <li><strong>RF2 - Menu Funcionário:</strong> Abertura, encerramento, consulta e alteração de contas; cadastro de funcionários; geração de relatórios.</li>
        <li><strong>RF3 - Menu Cliente:</strong> Depósito, saque, transferência, extrato, consulta de limite e logout seguro.</li>
        <li><strong>RF4 - Auditoria:</strong> Registro de todas as ações críticas como login, alterações de dados e transações.</li>
        <li><strong>RF5 - Relatórios:</strong> Geração de relatórios financeiros com exportação para Excel e PDF.</li>
      </ul>
    </section>

    <section>
      <h2>Requisitos Não Funcionais</h2>
      <ul>
        <li><strong>RNF1 - Desempenho:</strong> Consultas devem retornar em menos de 2 segundos mesmo com 10.000 transações.</li>
        <li><strong>RNF2 - Escalabilidade:</strong> Sistema deve suportar até 100 contas e 10.000 transações.</li>
        <li><strong>RNF3 - Segurança:</strong> Senhas criptografadas com MD5 ou superior, uso de OTP e auditoria de ações.</li>
        <li><strong>RNF4 - Usabilidade:</strong> Interface intuitiva com mensagens claras de erro/sucesso.</li>
        <li><strong>RNF5 - Portabilidade:</strong> Banco de dados compatível com MySQL 8.x e front-end multiplataforma.</li>
      </ul>
    </section>

    <section>
      <h2>Regras de Negócio</h2>
      <ul>
        <li>Todas as operações financeiras devem ser registradas na tabela <code>transacao</code>.</li>
        <li>Cada conta pode ser Poupança, Corrente ou Investimento, com campos específicos.</li>
        <li>Depósitos possuem um limite diário de R$10.000 por cliente.</li>
        <li>Funcionários têm hierarquia (Estagiário, Atendente, Gerente) e permissões diferenciadas.</li>
        <li>O score de crédito do cliente é calculado automaticamente com base nas transações realizadas.</li>
        <li>Encerramento de conta requer verificação de saldo e dívidas pendentes.</li>
        <li>Alterações em dados sensíveis são registradas na tabela <code>auditoria</code>.</li>
      </ul>
    </section>

    <section>
      <h2>Estrutura do Banco de Dados</h2>
      <p>O banco de dados foi projetado com as seguintes tabelas principais:</p>
      <ul>
        <li><code>usuario</code>: Armazena dados básicos e credenciais dos usuários.</li>
        <li><code>funcionario</code>: Informações detalhadas sobre os funcionários.</li>
        <li><code>cliente</code>: Dados dos clientes e seu score de crédito.</li>
        <li><code>conta</code>: Contém informações das contas bancárias (Poupança, Corrente, Investimento).</li>
        <li><code>transacao</code>: Registra todas as movimentações financeiras.</li>
        <li><code>auditoria</code>: Log de ações importantes no sistema.</li>
      </ul>
      <p>Gatilhos, procedimentos armazenados e visões foram implementados para garantir consistência e otimização.</p>
    </section>

    <section>
      <h2>Arquitetura do Projeto</h2>
      <ul>
        <li><strong>Backend:</strong> Desenvolvido em PHP com conexão ao MySQL via PDO.</li>
        <li><strong>Frontend:</strong> Interface desenvolvida com Next.js (React + TypeScript).</li>
        <li><strong>Banco de Dados:</strong> MySQL com estrutura relacional complexa.</li>
        <li><strong>Pacotes:</strong> Utilizamos padrão MVC com organização clara de diretórios.</li>
      </ul>
    </section>

    <section>
      <h2>Como Executar o Projeto</h2>
      <ol>
        <li>Instale o MySQL e importe o script de criação do banco de dados.</li>
        <li>Clone o repositório do backend em PHP e configure as credenciais do banco.</li>
        <li>Inicie o servidor PHP usando <code>php -S localhost:8000</code>.</li>
        <li>Clone o frontend em Next.js e execute <code>npm run dev</code>.</li>
        <li>Acesse o sistema através de <code>http://localhost:3000</code>.</li>
      </ol>
    </section>

    <section>
      <h2>Entrega Final</h2>
      <p>O projeto inclui:</p>
      <ul>
        <li>Código-fonte organizado em pacotes com comentários explicativos.</li>
        <li>Diagrama ER do banco de dados.</li>
        <li>Relatório completo com regras de negócio e instruções de instalação.</li>
        <li>Demonstração prática com apresentação de autenticação, operações e relatórios.</li>
      </ul>
    </section>

    <section>
      <h2>Créditos</h2>
      <p>Desenvolvido por alunos da Universidade Católica de Brasília como parte do trabalho final da disciplina de Programação Orientada a Objetos.</p>
    </section>
  </main>
</body>
</html>