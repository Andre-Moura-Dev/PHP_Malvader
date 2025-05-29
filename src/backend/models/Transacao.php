<?php
    class Transacao {
        private $db;

        public function __construct() {
            $this->db = Database::getInstance();
        }

        public function criar($idContaOrigem, $idContaDestino, $tipo, $valor, $descricao = null) {
            $stmt = $this->db->prepare("INSERT INTO Transacao (id_conta_origem, id_conta_destino, tipo_transacao, valor, descricao) 
            VALUES (:origem, :destino, :tipo, :valor, :descricao)");

            return $stmt->execute([
                ':origem' => $idContaOrigem,
                ':destino' => $idContaDestino,
                ':tipo' => $tipo,
                ':valor' => $valor,
                ':descricao' => $descricao
            ]);
        }

        public function listarPorConta($idConta, $limite = 10) {
            $stmt = $this->db->prepare("SELECT * FROM Transacao 
                                   WHERE id_conta_origem = :conta OR id_conta_destino = :conta 
                                   ORDER BY data_hora DESC LIMIT :limite");

            $stmt->bindValue(':conta', $idConta, PDO::PARAM_INT);
            $stmt->bindValue(':limite', $limite, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public function extratoPeriodo($idConta, $dataInicio, $dataFim) {
            $stmt = $this->db->prepare("SELECT * FROM transacao 
                                   WHERE (id_conta_origem = :conta OR id_conta_destino = :conta) 
                                   AND data_hora BETWEEN :inicio AND :fim 
                                   ORDER BY data_hora DESC");

            $stmt->execute([
                ':conta' => $idConta,
                ':inicio' => $dataInicio,
                ':fim' => $dataFim
            ]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    }
?>