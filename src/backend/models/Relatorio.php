<?php
    class Relatorio {
        private $db;

        public function __construct() {
            $this->db = Database::getInstance();
        }

        public function gerar($idFuncionario, $tipo, $conteudo) {
            $stmt = $this->db->prepare("INSERT INTO relatorio (id_funcionario, tipo_relatorio, conteudo) 
                                   VALUES (:funcionario, :tipo, :conteudo)");

            return $stmt->execute([
                ':funcionario' => $idFuncionario,
                ':tipo' => $tipo,
                ':conteudo' => $conteudo
            ]);
        }

        public function listarPorFuncionario($idFuncionario, $limite = 10) {
            $stmt = $this->db->prepare("SELECT * FROM Relatorio 
            WHERE id_funcionario = :funcionario ORBER BY data_geracao DESC LIMIT :limite");

            $stmt->bindValue(':funcionario', $idFuncionario, PDO::PARAM_INT);
            $stmt->bindValue(':limite', $limite, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public function obterDadosContasAtivas() {
            $stmt = $this->db->prepare("SELECT tipo_conta, COUNT(*) as total, SUM(saldo) as saldo_total FROM Conta 
            WHERE status = 'ATIVA' GROUP BY tipo_conta");

            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public function obterTransacoesPeriodo($dataInicio, $dataFim) {
            $stmt = $this->db->prepare("SELECT tipo_transacao, COUNT(*) as total, SUM(valor) as valor_total FROM Transacao 
            WHERE data_hora BETWEEN :inicio AND :fim GROUP BY tipo_transacao");

            $stmt->execute([
                ':inicio' => $dataInicio,
                ':fim' => $dataFim
            ]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    }
?>