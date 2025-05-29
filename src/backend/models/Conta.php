<?php
    class Conta {
        private $db;

        public function __construct() {
            $this->db = Database::getInstance();
        }

        public function criar($numeroConta, $idAgencia, $tipoConta, $idCliente) {
            $stmt = $this->db->prepare("INSERT INTO conta (numero_conta, id_agencia, tipo_conta, id_cliente) 
                                   VALUES (:numero, :agencia, :tipo, :cliente)");
            
            $stmt->execute([
                ':numero' => $numeroConta,
                ':agencia' => $idAgencia,
                ':tipo' => $tipoConta,
                ':cliente' => $idCliente
            ]);
            return $this->db->lastInsertId();
        }

        public function buscarPorNumero($numeroConta) {
            $stmt = $this->db->prepare("SELECT c.*, a.nome AS nome_agencia, a.codigo_agencia 
                                   FROM conta c JOIN agencia a ON c.id_agencia = a.id_agencia 
                                   WHERE c.numero_conta = :numero");

            $stmt->execute([':numero' => $numeroConta]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }

        public function listarPorCliente($idCliente) {
            $stmt = $this->db->prepare("SELECT c.*, a.nome AS nome_agencia 
                                   FROM conta c JOIN agencia a ON c.id_agencia = a.id_agencia 
                                   WHERE c.id_cliente = :cliente");

            $stmt->execute([':cliente' => $idCliente]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public function atualizarSaldo($idConta, $valor) {
            $stmt = $this->db->prepare("UPDATE Conta SET saldo = saldo + :valor 
            WHERE id_conta = :id");
            return $stmt->execute([':valor' => $valor, ':id' => $idConta]);
        }
    }
?>