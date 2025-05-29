<?php
    class ContaPoupanca {
        private $db;

        public function __construct() {
            $this->db = Database::getInstance();
        }

        public function criar($idConta, $taxaRendimento) {
            $stmt = $this->db->prepare("INSERT INTO Conta_Poupanca (id_conta, taxa_rendimento) VALUES (:conta, :taxa)");
            return $stmt->execute([
                ':conta' => $idConta,
                ':taxa' => $taxaRendimento
            ]);
        }

        public function aplicarRendimento($idConta) {
            $stmt = $this->db->prepare("UPDATE Conta_Poupanca SET ultimo_rendimento = NOW() 
            WHERE id_conta = :conta");
            return $stmt->execute([':conta' => $idConta]);
        }
    }
?>