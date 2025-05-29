<?php
    require_once __DIR__ . '/../models/Usuario.php';
    require_once __DIR__ . '/../models/Cliente.php';
    require_once __DIR__ . '/../models/Funcionario.php';
    require_once __DIR__ . '/../utils/auth.php';

    class AuthController {
        private $usuarioModel;
        private $clienteModel;
        private $funcionarioModel;

        public function __construct() {
            $this->usuarioModel = new Usuario();
            $this->clienteModel = new Cliente();
            $this->funcionarioModel = new Funcionario();
        }

        public function registrarCliente($dados) {
            // Validações
            if(!Validation::validateCPF($dados['cpf'])) {
                throw new Exception("CPF inválido");
            }

            if(!Validation::validateDate($dados['data_nascimento'])) {
                throw new Exception("Data de nascimento inválida");
            }

            if(!Validation::validatePhone($dados['telefone'])) {
                throw new Exception("Telefone inválido");
            }

            // Criar Usuário
            $idUsuario = $this->usuarioModel->criar(
                $dados['nome'],
                $dados['cpf'],
                $dados['data_nascimento'],
                $dados['telefone'],
                'CLIENTE',
                $dados['senha']
            );

            // Criar cliente
            $idCliente = $this->clienteModel->criar($idUsuario);

            return [
                'id_usuario' => $idUsuario,
                ':id_cliente' => $idCliente
            ];
        }

        public function login($cpf, $senha) {
            $usuario = $this->usuarioModel->buscarPorCPF($cpf);
            if(!$usuario || !password_verify($senha, $usuario['senha_hash'])) {
                throw new Exception("Credenciais inválidas");
            }

            // Gerar OTP
            $otp = rand(100000, 999999);
            $this->usuarioModel->atualizarOTP($usuario['id_usuario'], $otp);

            return [
                'id_usuario' => $usuario['id_usuario'],
                'tipo_usuario' => $usuario['tipo_usuario'],
                'otp_enviado' => true
            ];
        }

        public function verificarOTP($idUsuario, $otp) {
            $usuario = $this->usuarioModel->validarOTP($idUsuario, $otp);
            if(!$usuario) {
                throw new Exception("OTP inválido ou expirado");
            }

            // Gerar token JWT
            $token = Auth::generateToken($usuario['id_usuario'], $usuario['tipo_usuario']);

            return [
                'token' => $token,
                'tipo_usuario' => $usuario['tipo_usuario']
            ];
        }
    }
?>