<<<<<<< HEAD
<p align="center">  Desenvolvimento do Sistema - Banco Malvader </p> 
=======
<p align="center"># Desenvolvimento do Sistema - Banco Malvader</p> 
>>>>>>> dcb64f2b14e17de7abc03ed07417e01b3ac1f9e0

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
<<<<<<< HEAD
    -> Controllers: Classes de controle para acessar os models das classes.
    -> Config: configurações gerais do sistema, como: conexão com banco, jwt decoded e otp expiration.

# Docker - Rodar as portas para front e back

-> isso fará com que o front e back rodem em portas diferentes para que a aplicação possa rodar em diferentes portas.

# Astah - Modelagem dos diagrama de classes, caso de uso e sequência

-> Usei este software para modelar os diagramas do sistema bancário.
=======
>>>>>>> dcb64f2b14e17de7abc03ed07417e01b3ac1f9e0
