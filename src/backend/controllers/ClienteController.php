<?php
    require_once __DIR__ . '/../models/Cliente.php';
    require_once __DIR__ . '/../models/Conta.php';
    require_once __DIR__ . '/../models/Transacao.php';

    class ClienteController {
        private $clienteModel;
        private $contaModel;
        private $transacaoModel;

        public function __construct() {
            $this->clienteModel = new Cliente();
            $this->contaModel = new Conta();
            $this->transacaoModel = new Transacao();
        }

        public function obterDadosCliente($idCliente) {
            return $this->clienteModel->buscarPorId($idCliente);
        }

        public function listarContas($idCliente) {
            return $this->contaModel->listarPorCliente($idCliente);
        }

        public function realizarDeposito($idConta, $valor) {
            if($valor <= 0) {
                throw new Exception("Valor de depósito inválido");
            }

            // Verificar limite diário (implementado no trigger)
            return $this->transacaoModel->criar($idConta, null, 'DEPOSITO', $valor);
        }

        public function realizarSaque($idConta, $valor) {
            $conta = $this->contaModel->buscarPorNumero($idConta);
            if($conta['saldo'] < $valor) {
                throw new Exception("Saldo insuficiente");
            }

            return $this->transacaoModel->criar($idConta, null, 'SAQUE', $valor);
        }

        public function realizarTransferencia($idContaOrigem, $numeroContaDestino, $valor) {
            $contaOrigem = $this->contaModel->buscarPorNumero($idContaOrigem);
            $contaDestino = $this->contaModel->buscarPorNumero($numeroContaDestino);

            if(!$contaDestino) {
                throw new Exception("Conta destino não encontrada");
            }

            if($contaOrigem['saldo'] < $valor) {
                throw new Exception("Saldo insuficiente");
            }

            return $this->transacaoModel->criar(
                $idContaOrigem,
                $contaDestino['id_conta'],
                'TRANSFERENCIA',
                $valor
            );
        }

        public function obterExtrato($idConta, $limite = 10) {
            return $this->transacaoModel->listarPorContas($idConta, $limite);
        }
    }
?>