<?php
    class Funcionario {
        private $db;

        public function __construct() {
            $this->db = Database::getInstance();
        }

        public function criar($idUsuario, $codigoFuncionario, $cargo, $idSupervisor = null) {
            $stmt = $this->db->prepare("INSERT INTO Funcionario (id_usuario, codigo_funcionario, cargo, id_supervisor) 
                                   VALUES (:id_usuario, :codigo, :cargo, :supervisor)");

            $stmt->execute([
                ':id_usuario' => $idUsuario,
                ':codigo' => $codigoFuncionario,
                ':cargo' => $cargo,
                ':supervisor' => $idSupervisor
            ]);
            return $this->db->lastInsertId();
        }

        public function buscarPorCodigo($codigoFuncionario) {
            $stmt = $this->db->prepare("SELECT f.*, u.nome, u.cpf FROM Funcionario f 
            JOIN Usuario u ON f.id_usuario = u.id_usuario 
            WHERE f.codigo_funcionario = :codigo");
            $stmt->execute([':codigo' => $codigoFuncionario]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }

        public function listarPorCargo($cargo) {
            $stmt = $this->db->prepare("SELECT f.*, u.nome FROM Funcionario f 
            JOIN Usuario u ON f.id_funcionario = u.id_usuario 
            WHERE f.cargo = :cargo");
            $stmt->execute([':cargo' => $cargo]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    }
?>