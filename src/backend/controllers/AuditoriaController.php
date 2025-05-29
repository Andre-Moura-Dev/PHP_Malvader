<?php
    require_once __DIR__ . '/../models/Auditoria.php';

    class AuditoriaController {
        private $auditoriaModel;

        public function __construct() {
            $this->auditoriaModel = new Auditoria();
        }

        public function registrarAcao($idUsuario, $acao, $detalhes = null) {
            return $this->auditoriaModel->registrar($idUsuario, $acao, $detalhes);
        }

        public function listarAuditoria($filtros = []) {
            return $this->auditoriaModel->listar($filtros);
        }
    }
?>