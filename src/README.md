# Desenvolvimento do Sistema - Banco Malvader

## Apresentação

-> Olá, será apresentado neste documento uma aplicação BackEnd e FrontEnd de um sistema bancário que permitírá o usuário abrir contas, verificar saldo, depositar, sacar e etc...

# FrontEnd - Next.js, react e javascript

-> Para montar o FrontEnd estou usando next.js para usar a biblioteca do javascript "react" com javascript.

-> Auth: Autenticação de clientes e funcionários que verifica que tipo de usuário está logado no sistema.
-> API: Conexão entre os dados do FrontEnd e BackEnd para buscar os dados.
-> Shared: Pasta compartilhada entre os dados do FrontEnd e BackEnd e as apis.
-> Styles: css global para cada component do front.
-> App.jsx: aplicação que carregará a página principal chamada "index.jsx" para mostrar a página principal.
-> index.jsx: terá a função de mostrar a página principal da aplicação do sistema bancário.
-> Database: armazenará o banco de dados com todas as informações do sistema.
-> Hooks: terá a função de carregar o arquivo "useAuth.js" para logar no sistema.


# BackEnd - PHP com laravel e SQL

-> Para montar o BackEnd estou usando PHP com laravel e SQL para pegar as querys do banco de dados e colocar nos respectivos models e controllers.

-> Routes: API para conectar todos os arquivos do BackEnd para expor as rotas para o FrontEnd.
-> Utils: Configuração do banco de dados, validação dos logins de cada usuário e validação de dados do sistema.
-> Public: 
    -> index.php: index do BackEnd para armazenar as rotas da API para carregar os dados.
    -> .htaccess: configuração para rodar os dados do banco para o BackEnd.