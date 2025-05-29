<?php
    require_once __DIR__ . '/../models/Relatorio.php';
    require_once __DIR__ . '/../models/Transacao.php';
    require_once __DIR__ . '/../models/Conta.php';

    class RelatorioController {
        private $relatorioModel;
        private $transacaoModel;
        private $contaModel;

        public function __construct() {
            $this->relatorioModel = new Relatorio();
            $this->transacaoModel = new Model();
            $this->contaModel = new conta();
        }

        public function gerarRelatorioContas($idFuncionario) {
            $dados = $this->relatorioModel->obterDadosContasAtivas();
            $conteudo = json_encode($dados);
            return $this->relatorioModel->gerar($idFuncionario, ' CONTAS_ATIVAS ', $conteudo);
        }

        public function gerarRelatorioTransacoes($idFuncionario, $dataInicio, $dataFim) {
            $dados = $this->relatorioModel->obterTransacoesPeriodo($dataInicio, $dataFim);
            $conteudo = json_encode([
                'periodo' => ['inicio' => $dataInicio, 'fim' => $dataFim],
                'transacoes' => $dados
            ]);
            return $this->relatorioModel->gerar($idFuncionario, ' TRANSAÇÕES_PERIODO ', $conteudo);
        }

        public function listarRelatorios($idFuncionario) {
            return $this->relatorioModel->listarPorFuncionario($idFuncionario);
        }
    }
?>