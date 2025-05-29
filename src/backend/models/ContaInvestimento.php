<?php
    class ContaInvestimento {
        private $db;

        public function __construct() {
            $this->db = Database::getInstance();
        }

        public function criar($idConta, $perfilRisco, $valorMinimo, $taxaRendimentoBase) {
            $stmt = $this->db->prepare("INSERT INTO Conta_Investimento (id_conta, perfil_risco, valor_minimo, taxa_rendimento_base) VALUES (:conta, :perfil, :minimo, :taxa)");

            return $stmt->execute([
                ':conta' => $idConta,
                ':perfil' => $perfilRisco,
                ':minimo' => $valorMinimo,
                ':taxa' => $taxaRendimentoBase
            ]);
        }

        public function atualizarRendimento($idConta, $rendimentoAdicional) {
            $stmt = $this->db->prepare("UPDATE Conta_Investimento SET taxa_rendimento_base + :rendimento 
            WHERE id_conta = :conta");

            return $stmt->execute([
                ':rendimento' => $rendimentoAdicional,
                ':conta' => $idConta
            ]);
        }
    }
?>