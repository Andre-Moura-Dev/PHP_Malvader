<?php
    require_once __DIR__ . '/../models/Funcionario.php';
    require_once __DIR__ . '/../models/Usuario.php';
    require_once __DIR__ . '/../models/Cliente.php';

    class FuncionarioController {
        private $funcionarioModel;
        private $usuarioModel;
        private $clienteModel;

        public function __construct() {
            $this->funcionarioModel = new Funcionario();
            $this->usuarioModel = new Usuario();
            $this->clienteModel = new Cliente();
        }

        public function cadastrarFuncionario($dados) {
            // Validações
            if(!Validation::validateCPF($dados['cpf'])) {
                throw new Exception("CPF inválido");
            }
            if(!Validation::validateDate($dados['data_nascimento'])) {
                throw new Exception("Data de nascimento inválida");
            }
            
            // Verificar se CPF já existe
            if($this->usuarioModel->buscarPorCPF($dados['cpf'])) {
                throw new Exception("CPF já cadastrado");
            }

            // Criar Usuário
            $idUsuario = $this->usuarioModel->criar(
                $dados['nome'],
                $dados['cpf'],
                $dados['data_nascimento'],
                $dados['telefone'],
                'FUNCIONARIO',
                $dados['senha']
            );

            // Criar Funcionário
            $idFuncionario = $this->funcionarioModel->criar(
                $idUsuario,
                $dados['codigo_funcionario'],
                $dados['cargo'],
                $dados['id_supervisor'] ?? null
            );

            return [
                'id_usuario' => $idUsuario,
                'id_funcionario' => $idFuncionario
            ];
        }

        public function listarClientes($filtros = []) {
            $query = "SELECT c.*, u.nome, u.cpf, u.telefone 
            FROM cliente c JOIN usuario u ON c.id_usuario = u.id_usuario";
            $where = [];
            $params = [];

            if(!empty($filtros['nome'])) {
                $where[] = "u.nome LIKE :nome";
                $params[':nome'] = '%' . $filtros['nome'] . '%';
            }
            if(!empty($filtros['cpf'])) {
                $where[] = "u.cpf = :cpf";
                $params[':cpf'] = $filtros['cpf'];
            }
            if(!empty($where)) {
                $query .= "WHERE" . implode(" AND ", $where);
            }

            $query .= " LIMIT 100 ";
            $stmt = $this->db->prepare($query);
            $stmt->execute($params);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public function obterDadosFuncionarios($idFuncionario) {
            return $this->funcionarioModel->buscarPorCodigo($idFuncionario);
        }
    }
?>