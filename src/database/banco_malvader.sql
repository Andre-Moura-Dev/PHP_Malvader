create database banco_malvader;

use banco_malvader;


-- Tabelas do Banco
create table Usuario (
	id_usuario int auto_increment primary key,
    nome varchar(100) not null,
    cpf varchar(11) unique not null,
    data_nascimento date not null,
    telefone varchar(15) not null,
    tipo_usuario enum('Funcionario', 'Cliente') not null,
    senha_hash varchar(255) not null,
    otp_ativo varchar(6) not null,
    otp_expiracao datetime
);

create table Funcionario (
	id_funcionario int auto_increment primary key,
    id_usuario int not null,
    codigo_funcionario varchar(20) unique not null,
    cargo enum('Estagiario', 'Atendente', 'Gerente') not null,
    id_supervisor int not null,
    constraint foreign key (id_usuario) references Usuario(id_usuario),
    constraint foreign key (id_supervisor) references Funcionario(id_funcionario)
);

create table Cliente (
	id_cliente int auto_increment primary key,
    id_usuario int not null,
    score_credito decimal(5,2) default 0,
    constraint foreign key (id_usuario) references Usuario(id_usuario)
);

create table Endereco (
	id_endereco int auto_increment primary key,
    id_usuario int not null,
    cep varchar(10) not null,
    local varchar(100) not null,
    numero_casa int not null,
    bairro varchar(45) not null,
    cidade varchar(45) not null,
    estado char(2) not null,
    complemento varchar(45) not null,
    constraint foreign key (id_usuario) references Usuario(id_usuario)
);
create index idx_cep on Endereco(cep);

create table Agencia (
	id_agencia int auto_increment primary key,
    nome varchar(45) not null,
    codigo_agencia varchar(10) unique not null,
    endereco_id int not null,
    foreign key (endereco_id) references Endereco(id_endereco)
);

create table Conta (
	id_conta int auto_increment primary key,
    numero_conta varchar(20) unique not null,
    id_agencia int not null,
    saldo decimal(15,2) not null default 0,
    tipo_conta enum('Poupança', 'Corrente', 'Investimento') not null,
    id_cliente int not null,
    data_abertura datetime not null default current_timestamp,
    status enum('Ativa', 'Encerrada', 'Bloqueada') not null default 'Ativa',
    constraint foreign key (id_agencia) references Agencia(id_agencia),
    constraint foreign key (id_cliente) references Cliente(id_cliente)
);
create index idx_numero_conta on Conta(numero_conta);

create table Conta_Poupanca (
	id_conta_poupanca int auto_increment primary key,
    id_conta int not null,
    taxa_rendimento decimal(15,2) not null,
    ultimo_rendimento datetime,
    constraint foreign key (id_conta) references Conta(id_conta),
    unique key (id_conta)
);

create table Conta_Corrente (
	id_conta_corrente int auto_increment primary key,
    id_conta int not null,
    limite decimal(15,2) not null default 0,
    data_vencimento date not null,
    taxa_manutencao decimal(5,2) not null default 0,
    constraint foreign key (id_conta) references Conta(id_conta),
    unique key (id_conta)
);

create table Conta_Investimento (
	id_conta_investimento int not null auto_increment primary key,
    id_conta int not null,
    perfil_risco enum('Baixo', 'Medio', 'Alto') not null,
    valor_minimo decimal(15,2) not null,
    taxa_rendimento_base decimal(5,2) not null,
    constraint foreign key (id_conta) references Conta(id_conta),
    unique key (id_conta)
);

create table Transacao (
	id_transacao int auto_increment primary key,
    id_conta_origem int not null,
    id_conta_destino int not null,
    tipo_transacao enum('Deposito', 'Saque', 'Transferencia', 'Taxa', 'Rendimento') not null,
    valor decimal(15,2) not null,
    data_hora timestamp not null default current_timestamp,
    descricao varchar(100) not null,
    constraint foreign key (id_conta_origem) references Conta(id_conta),
    constraint foreign key (id_conta_destino) references Conta(id_conta)
);
create index idx_data_hora on transacao(data_hora);

create table Auditoria (
	id_auditoria int auto_increment primary key,
    id_usuario int not null,
    acao varchar(50) not null,
    data_hora timestamp not null default current_timestamp,
    detalhes text,
    constraint foreign key (id_usuario) references Usuario(id_usuario)
);

create table Relatorio (
	id_relatorio int auto_increment primary key,
    id_funcionario int not null,
    tipo_relatorio varchar(50) not null,
    data_geracao timestamp not null default current_timestamp,
    conteudo text not null,
    constraint foreign key (id_funcionario) references Funcionario(id_funcionario)
);

-- Seleções das tabelas
select * from banco_malvader.usuario;
select * from banco_malvader.funcionario;
select * from banco_malvader.cliente;
select * from banco_malvader.endereco;
select * from banco_malvader.agencia;
select * from banco_malvader.conta;
select * from banco_malvader.conta_poupanca;
select * from banco_malvader.conta_corrente;
select * from banco_malvader.conta_investimento;
select * from banco_malvader.transacao;
select * from banco_malvader.auditoria;
select * from banco_malvader.relatorio;

/* Inserção de Valores */
INSERT INTO Usuario (nome, cpf, data_nascimento, telefone, tipo_usuario, senha_hash, otp_ativo, otp_expiracao) VALUES
('João Silva', '980.768.321', '1985-03-15', '9-9345-8907', 'Funcionario', 'hash123func', '123456', '2025-06-06 10:00:00'),
('Maria Souza', '567.890.432', '1990-07-20', '9-9781-5210', 'Funcionario', 'hash456func', '654321', '2025-06-06 10:05:00'),
('Pedro Santos', '213.890.765', '1978-11-01', '9-9521-7654', 'Cliente', 'hash789cli', '987654', '2025-06-06 10:10:00'),
('Ana Oliveira', '765.890.435', '1995-01-25', '9-9780-4567', 'Cliente', 'hash012cli', '456789', '2025-06-06 10:15:00'),
('Carlos Pereira', '980.768.432', '1982-09-10', '9-9321-9078', 'Cliente', 'hash345cli', '789012', '2025-06-06 10:20:00');

INSERT INTO Funcionario (id_usuario, codigo_funcionario, cargo, id_supervisor) VALUES
(1, 'FUNC001', 'Gerente', 1), -- João Silva é gerente e seu próprio supervisor (ou um supervisor fictício para o nível mais alto)
(2, 'FUNC002', 'Atendente', 1); -- Maria Souza é atendente, supervisionada por João Silva


INSERT INTO Cliente (id_usuario, score_credito) VALUES
(3, 850.00), -- Pedro Santos
(4, 720.50), -- Ana Oliveira
(5, 680.75); -- Carlos Pereira


INSERT INTO Endereco (id_usuario, cep, local, numero_casa, bairro, cidade, estado, complemento) VALUES
(1, '01000-001', 'Rua Principal', 100, 'Centro', 'São Paulo', 'SP', 'Apto 101'), -- Endereço do João (Funcionário)
(3, '02000-002', 'Avenida Secundária', 250, 'Jardins', 'Rio de Janeiro', 'RJ', 'Casa 2'), -- Endereço do Pedro (Cliente)
(4, '03000-003', 'Travessa da Paz', 30, 'Vila Nova', 'Belo Horizonte', 'MG', 'Bloco C, Apto 5'), -- Endereço da Ana (Cliente)
(4, '04000-004', 'Praça da Liberdade', 50, 'Centro', 'Curitiba', 'PR', 'Prédio Comercial'), -- Endereço para Agência 1
(5, '05000-005', 'Rua das Flores', 75, 'Bela Vista', 'Porto Alegre', 'RS', 'Sala 201'); -- Endereço para Agência 2


INSERT INTO Agencia (nome, codigo_agencia, endereco_id) VALUES
('Agência Central SP', 'AGC001', 4), -- Referencia o endereço "Praça da Liberdade"
('Agência Zona Sul RJ', 'AGZ002', 5); -- Referencia o endereço "Rua das Flores"


INSERT INTO Conta (numero_conta, id_agencia, saldo, tipo_conta, id_cliente, data_abertura, status) VALUES
('12345-6', 1, 1500.00, 'Corrente', 1, '2023-01-10 10:30:00', 'Ativa'), -- Pedro Santos (id_cliente 1)
('78901-2', 1, 5000.00, 'Poupança', 1, '2023-01-10 10:35:00', 'Ativa'), -- Pedro Santos (id_cliente 1)
('34567-8', 2, 2500.00, 'Investimento', 2, '2023-02-15 11:00:00', 'Ativa'), -- Ana Oliveira (id_cliente 2)
('90123-4', 2, 300.00, 'Corrente', 3, '2023-03-20 09:45:00', 'Ativa'); -- Carlos Pereira (id_cliente 3)


INSERT INTO Conta_Corrente (id_conta, limite, data_vencimento, taxa_manutencao) VALUES
(1, 1000.00, '2025-12-31', 15.00), -- Conta Corrente do Pedro
(4, 500.00, '2025-11-30', 10.00); -- Conta Corrente do Carlos


INSERT INTO Conta_Poupanca (id_conta, taxa_rendimento, ultimo_rendimento) VALUES
(2, 0.05, '2025-05-01 00:00:00'); -- Conta Poupança do Pedro


INSERT INTO Conta_Investimento (id_conta, perfil_risco, valor_minimo, taxa_rendimento_base) VALUES
(3, 'Medio', 1000.00, 0.08); -- Conta Investimento da Ana


INSERT INTO Transacao (id_conta_origem, id_conta_destino, tipo_transacao, valor, data_hora, descricao) VALUES
(1, 1, 'Deposito', 500.00, '2024-05-01 14:00:00', 'Depósito em conta corrente'),
(1, 1, 'Saque', 100.00, '2024-05-02 10:00:00', 'Saque em caixa eletrônico'),
(1, 3, 'Transferencia', 200.00, '2024-05-03 16:30:00', 'Transferência para conta de investimento da Ana'),
(2, 2, 'Rendimento', 25.00, '2024-06-01 00:00:00', 'Rendimento mensal da poupança'),
(4, 4, 'Taxa', 10.00, '2024-06-05 08:00:00', 'Taxa de manutenção mensal');


INSERT INTO Auditoria (id_usuario, acao, data_hora, detalhes) VALUES
(1, 'Login', '2024-06-05 09:00:00', 'Login bem-sucedido do gerente'),
(3, 'Consulta Saldo', '2024-06-05 09:15:00', 'Cliente Pedro consultou saldo da conta corrente'),
(2, 'Abertura Conta', '2024-06-05 09:20:00', 'Atendente Maria abriu nova conta para cliente Ana');


INSERT INTO Relatorio (id_funcionario, tipo_relatorio, data_geracao, conteudo) VALUES
(1, 'Relatório de Transações Mensais', '2024-06-01 10:00:00', 'Conteúdo do relatório de transações de maio.'),
(2, 'Relatório de Clientes Ativos', '2024-06-03 15:30:00', 'Lista de clientes com contas ativas no último trimestre.');

-- Gatilhos
delimiter $$
create trigger atualizar_saldo after insert on Transacao
for each row
begin
    if new.tipo_transacao = 'Depósito' then
		update Conta set saldo = saldo + new.valor where id_conta = new.id_conta_origem;
	elseif new.tipo_transacao in ('Saque', 'Taxa') then
		update Conta set saldo = saldo - new.valor where id_conta = new.id_conta_origem;
	elseif new.tipo_transacao = 'Transferência' then
		update Conta set saldo = saldo - new.valor where id_conta = new.id_conta_origem;
        update Conta set saldo = saldo + new.valor where id_conta = new.id_conta_destino;
	end if;
end $$
delimiter ;

delimiter $$
create trigger validar_senha before update on Usuario
for each row
begin 
	if new.senha_hash regexp '^[0-9a-f]{32}$' then
		signal sqlstate '4500' set message_text = 'Senha deve ser atualizada via procedure com validação';
	end if;
end $$
delimiter ;

delimiter $$
create trigger limite_deposito before insert on Transacao
for each row
begin
	declare total_dia decimal(15,2);
    select sum(valor) into total_dia
    from Transacao
    where id_conta_origem = new.id_conta_origem
		and tipo_transacao = 'Depósito'
        and date(data_hora) = date(new.data_hora);
	if (total_dia + new.valor) > 10000 then
		signal sqlstate '45000' set message_text = 'Limite diário de depósito excedido';
	end if;
end $$
delimiter ;

-- Procedimentos Armazenados
delimiter $$
create procedure gerar_otp(in id_usuario int)
begin
	declare novo_otp varchar(6);
    set novo_otp = lpad(floor(rand() * 1000000), 6, '0');
    update Usuario set otp_ativo = novo_otp, otp_expiracao = now() + interval 5 minute
    where id_usuario = id_usuario;
    select novo_otp;
end $$
delimiter ;

delimiter $$
create procedure calcular_score_credito(in id_cliente int)
begin
	declare total_trans decimal(15,2);
    declare media_trans decimal(15,2);
    select sum(valor), avg(valor) into total_trans, media_trans
    from Transacao t
    join Conta c on t.id_conta_origem = c.id_conta
    where c.id_cliente = id_cliente and t.tipo_transacao in ('Depósito', 'Saque');
    update Cliente set score_credito = least(100, (total_trans / 1000) + (media_trans / 100))
    where id_cliente = id_cliente;
end $$
delimiter ;

-- Visões
create view vw_resumo_contas as
select c.id_cliente, u.nome, count(co.id_conta) as total_contas, sum(co.saldo) as saldo_total
from Cliente c
join Usuario u on c.id_usuario = u.id_usuario
join Conta co on c.id_cliente = co.id_cliente
group by c.id_cliente, u.nome;

create view vw_movimentacoes_recentes as
select t.*, c.numero_conta, u.nome as Cliente
from Transacao t
join Conta c on t.id_conta_origem = c.id_conta
join Cliente cl on c.id_cliente = cl.id_cliente
join Usuario u on cl.id_usuario = u.id_usuario
where t.data_hora >= now() - interval 90 day;