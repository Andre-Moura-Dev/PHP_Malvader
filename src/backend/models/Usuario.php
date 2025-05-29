<?php
    class Usuario {
        private $db;

        public function __construct() {
            $this->db = Database::getInstance();
        }

        public function criar($nome, $cpf, $dataNascimento, $telefone, $tipoUsuario, $senha, $otp_ativo, $otp_expiracao) {
            $stmt = $this->db->prepare("INSERT INTO Usuario (nome, cpf, data_nascimento, telefone, tipo_usuario, senha_hash, otp_ativo, otp_expiracao) 
            VALUES (:nome, 
            :cpf, 
            :data_nascimento, 
            :telefone, 
            :tipo_usuario, 
            :senha_hash,
            :otp_ativo,
            :otp_expiracao)");

            $stmt->execute([
                ':nome' => $nome,
                ':cpf' => $cpf,
                ':data_nascimento' => $dataNascimento,
                ':telefone' => $telefone,
                ':tipo_usuario' => $tipoUsuario,
                ':senha_hash' => password_hash($senha, PASSWORD_BCRYPT),
                ':otp_ativo' => $otp_ativo,
                ':otp_expiracao' => $otp_expiracao
            ]);
            return $this->db->lastInsertId();
        }

        public function buscarPorCPF($cpf) {
            $stmt = $this->db->prepare("SELECT * FROM Usuario WHERE cpf = :cpf");
            $stmt->execute([':cpf' => $cpf]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }

        public function atualizarOTP($idUsuario, $otp) {
            $stmt = $this->db->prepare("UPDATE Usuario SET otp_ativo = :otp, 
            otp_expiracao = DATE_ADD(NOW(), INTERVAL 5 MINUTE) 
            WHERE id_usuario = :id");
            return $stmt->execute([':otp' => $otp, ':id' => $idUsuario]);
        }

        public function validarOTP($idUsuario, $otp) {
            $stmt = $this->db->prepare("SELECT * FROM Usuario 
            WHERE id_usuario = :id AND otp_ativo = :otp AND otp_expiracao > NOW()");
            $stmt->execute([':id' => $idUsuario, ':otp' => $otp]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
    }
?>