<?php
    class ContaCorrente {
        private $db;

        public function __construct() {
            $this->sb = Database::getInstance();
        }

        public function criar($idConta, $limite, $dataVencimento, $taxaManutencao) {
            $stmt = $this->db->prepare("INSERT INTO Conta_Corrente (id_conta, limite, data_vencimento, taxa_manutencao) 
            VALUES (:conta, :limite, :vencimento, :taxa)");
            
            return $stmt->execute([
                ':conta' => $idConta,
                ':limite' => $limite,
                ':vencimento' => $dataVencimento,
                ':taxa' => $taxaManutencao
            ]);
        }

        public function cobrarTaxaManutencao($idConta) {
            $stmt = $this->db->prepare("UPDATE Conta_Corrente SET data_vencimento = 
            DATE_ADD(data_vencimento, INTERVAL 1 MONTH) 
            WHERE id_conta = :conta");

            return $stmt->execute([':conta' => $idConta]);
        }
    }
?>