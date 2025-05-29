<?php
    class Cliente {
        private $db;

        public function __construct() {
            $this->db = Database::getInstance();
        }

        public function criar($idUsuario) {
            $stmt = $this->db->prepare("INSERT INTO Cliente (id_usuario) 
            VALUES (:id_usuario)");
            $stmt->execute([':id_usuario' => $idUsuario]);
            return $this->db->lastInsertId();
        }

        public function buscarPorId($idCliente) {
            $stmt = $this->db->prepare("SELECT c.*, u.nome, u.cpf, u.data_nascimento, u.telefone 
                                   FROM cliente c JOIN usuario u ON c.id_usuario = u.id_usuario 
                                   WHERE c.id_cliente = :id");

            $stmt->execute([':id' => $idCliente]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }

        public function atualizarScore($idCliente) {
            $stmt = $this->db->prepare("CALL calcular_score_credito(:id_cliente)");
            return $stmt->execute([':id_cliente' => $idCliente]);
        }
    }
?>