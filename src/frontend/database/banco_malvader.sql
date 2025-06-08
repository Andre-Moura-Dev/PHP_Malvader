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