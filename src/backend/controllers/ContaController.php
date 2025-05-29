<?php
    require_once __DIR__ . '/../models/Conta.php';
    require_once __DIR__ . '/../models/ContaPoupanca.php';
    require_once __DIR__ . '/../models/ContaCorrente.php';
    require_once __DIR__ . '/../models/ContaInvestimento.php';

    class ContaController {
        private $contaModel;
        private $contaPoupancaModel;
        private $contaCorrenteModel;
        private $contaInvestimentoModel;

        public function __construct() {
            $this->contaModel = new Conta();
            $this->contaPounpancaModel = new ContaPounpanca();
            $this->contaCorrenteModel = new ContaCorrente();
            $this->contaInvestimentoModel = new ContaInvestimento();
        }

        public function abrirConta($tipo, $idAgencia, $idCliente, $dadosEspecificos) {
            // Gerar número de conta único
            $numeroConta = $this->gerarNumeroConta();

            // Criar conta base
            $idConta = $this->contaModel->criar($numeroConta, $idAgencia, $tipo, $idCliente);

            // Criar conta específica
            switch ($tipo) {
                case 'POUPANCA':
                    $this->contaPoupancaModel->criar($idConta, $dadosEspecificos['taxa_rendimento']);
                    break;
                case 'CORRENTE':
                    $this->contaCorrenteModel->criar(
                        $idConta,
                        $dadosEspecificos['limite'],
                        $dadosEspecificos['data_vencimento'],
                        $dadosEspecificos['taxa_manutencao']
                    );
                    break;
                case 'INVESTIMENTO':
                    $this->contaInvestimentoModel->criar(
                        $idConta,
                        $dadosEspecificos['perfil_risco'],
                        $dadosEspecificos['valor_minimo'],
                        $dadosEspecificos['taxa_rendimento_base']
                    );
                    break;
                default:
                    throw new Exception("Tipo de conta inválido");
            }

            return $numeroConta;
        }

        private function gerarNumeroConta() {
            return rand(100000, 999999) . '-' . rand(0, 9);
        }

        public function encerrarConta($numeroConta) {
            $conta = $this->contaModel->buscarPorNumero($numeroConta);
            if(!$conta) {
                throw new Exception("Conta");
            }
            if($conta['saldo'] != 0) {
                throw new Exception("Não é possível encerrar conta com saldo diferente de zero");
            }

            $stmt = $this->db->prepare("UPDATE Conta SET status = 'ENCERRADA' 
            WHERE numero_conta =:numero");
            return $stmt->execute([':numero' => $numeroConta]);
        }

        public function bloquearConta($numeroConta) {
            $stmt = $this->db->prepare("UPDATE conta SET status = 'BLOQUEADA' 
            WHERE numero_conta = :numero");
            return $stmt->execute([':numero' => $numeroConta]);
        }
    }
?>