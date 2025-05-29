<?php
    require_once __DIR__ . '/../models/Transacao.php';
    require_once __DIR__ . '/../models/Conta.php';

    class TransacaoController {
        private $transacaoModel;
        private $contaModel;

        public function __construct() {
            $this->transacaoModel = new Transacao();
            $this->contaModel = new Conta();
        }

        public function listarTransacoes($filtros = []) {
            $query = "SELECT t.*, co.numero_conta as conta_origem, cd.numero_conta as conta_destino 
                 FROM Transacao t 
                 LEFT JOIN conta co ON t.id_conta_origem = co.id_conta 
                 LEFT JOIN conta cd ON t.id_conta_destino = cd.id_conta";

            $where = [];
            $params = [];

            if(!empty($filtros['data_inicio'])) {
                $where[] = "t.data_hora >= :data_inicio";
                $params[':data_inicio'] = $filtros['data_inicio'];
            }

            if(!empty($filtros['data_fim'])) {
                $where[] = "t.data_hora <= :data_fim";
                $params[':data_fim'] = $filtros['data_fim'];
            }

            if(!empty($filtros['tipo'])) {
                $where[] = "t.tipo_transacao = :tipo";
                $params[':tipo'] = $filtros['tipo'];
            }

            if(!empty($filtros['conta_origem'])) {
                $where[] = "co.numero_conta = :conta_origem";
                $params[':conta_origem'] = $filtros['conta_origem'];
            }

            if(!empty($where)) {
                $query .= " ORDER BY t.data_hora DESC LIMIT 100 ";
                $stmt = $this->db->prepare($query);
                $stmt->execute($params);
                return $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
        }

        public function obterDetalhesTransacao($idTransacao) {
            $query = "SELECT t.*, 
                 co.numero_conta as conta_origem, uo.nome as cliente_origem,
                 cd.numero_conta as conta_destino, ud.nome as cliente_destino
                 FROM transacao t
                 LEFT JOIN conta co ON t.id_conta_origem = co.id_conta
                 LEFT JOIN cliente clo ON co.id_cliente = clo.id_cliente
                 LEFT JOIN usuario uo ON clo.id_usuario = uo.id_usuario
                 LEFT JOIN conta cd ON t.id_conta_destino = cd.id_conta
                 LEFT JOIN cliente cld ON cd.id_cliente = cld.id_cliente
                 LEFT JOIN usuario ud ON cld.id_usuario = ud.id_usuario
                 WHERE t.id_transacao = :id";

            $stmt = $this->db->prepare($query);
            $stmt->execute([':id' => $idTransacao]);
            return $stmt->fetch(PDO::FECTH_ASSOC);
        }
    }
?>