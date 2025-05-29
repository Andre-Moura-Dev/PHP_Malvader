<?php
    class Auditoria {
        private $db;

        public function __construct() {
            $this->db = Database::getInstance();
        }

        public function registrar($idUsuario, $acao, $detalhes = null) {
            $stmt = $this->db->prepare("INSERT INTO Auditoria (id_usuario, acao, detalhes) VALUES (:usuario, :acao, :detalhes)");

            return $stmt->execute([
                ':usuario' => $idUsuario,
                ':acao' => $acao,
                ':detalhes' => $detalhes
            ]);
        }

        public function listar($filtros = [], $limite = 50) {
            $query = "SELECT a.*, u.nome FROM Auditoria a 
            JOIN Usuario u ON a.id_usuario = u.id_usuario";
            $where = [];
            $params = [];

            if (!empty($filtros['data_inicio'])) {
                $where[] = "a.data_hora >= :data_inicio";
                $params[':data_inicio'] = $filtros['data_inicio'];
            }

            if(!empty($filtros['data_fim'])) {
                $where[] = "a.data_hora <= :data_fim";
                $params[':id_usuario'] = $filtros['data_fim'];
            }

            if(!empty($filtros['id_usuario'])) {
                $where[] = "a.id_usuario = :id_usuario";
                $params[':id_usuario'] = $filtros['id_usuario'];
            }

            if(!empty($where)) {
                $query .= "WHERE" . implode(" AND ", $where);
            }

            $query .= " ORDER BY a.data_hora DESC LIMIT :limite ";
            $params[':limite'] = $limite;

            $stmt = $this->db->prepare($query);
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value, is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR);
            }
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    }
?>