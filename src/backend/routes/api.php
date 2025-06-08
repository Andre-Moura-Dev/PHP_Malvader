<?php
    require_once __DIR__ . '/../../vendor/autoload.php';
    require_once __DIR__ . '/../controllers/AuthController.php';
    require_once __DIR__ . '/../controllers/ClienteController.php';
    require_once __DIR__ . '/../controllers/ContaController.php';
    require_once __DIR__ . '/../controllers/FuncionarioController.php';
    require_once __DIR__ . '/../controllers/TransacaoController.php';
    require_once __DIR__ . '/../controllers/RelatorioController.php';
    require_once __DIR__ . '/../controllers/AuditoriaController.php';
    require_once __DIR__ . '/../utils/auth.php';

    header("Content-Type: application/json");

    $requestMethod = $_SERVER['REQUEST_METHOD'];
    $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $requestUri = str_replace('/api/', '', $requestUri);

    try {
        // Public Routes
        switch($requestUri) {
            case 'auth/register':
                if($requestMethod == 'POST') {
                    $data = json_decode(file_get_contents('php://input'), true);
                    $authController = new AuthController();
                    $result = $authController->registrarCliente($data);
                    echo json_encode(['success' => true, 'data' => $result]);
                } else {
                    throw new Exception("Méotodo não permitido", 405);
                }
                break;
            case 'auth/login':
                if($requestMethod == 'POST') {
                    $data = json_encode(file_get_contents('php://input'), true);
                    $authController = new AuthController();
                    $result = $authController->login($data['cpf'], $data['senha']);
                    echo json_encode(['success' => true, 'data' => $result]);
                } else {
                    throw new Exception("Método não permitido", 405);
                }
                break;
            case 'auth/verify-otp':
                if($requestMethod == 'POST') {
                    $data = json_encode(file_get_contents('php://input'), true);
                    $authController = new AuthController();
                    $result = $authController->verificarOTP($data['id_usuario'], $data['otp']);

                    echo json_encode(['success' => true, 'data' => $result]);
                } else {
                    throw new Exception("Método não permitido", 405);
                }
                break;
        }
        // Verificar token JWT para rotas protegidas
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if(strops($authHeader, 'Bearer') !== 0) {
            throw new Exception("Token de autenticação não fornecido", 401);
        }

        $userId = $decodedToken['sub'];
        $usertype = $decodedToken['type'];

        // Rotas protegidas
        switch($requestUri) {
            // Rotas Clientes
            case 'cliente/dados':
                if($requestMethod == 'GET') {
                    $clienteController = new ClienteController();
                    $result = $clienteController->obterDadosCliente($userId);
                    echo json_encode(['success' => true, 'data' => $result]);
                } else {
                    throw new Exception("Método não permitido", 405);
                }
                break;
            case 'cliente/contas':
                if($requestMethod == 'GET') {
                    $clienteController = new ClienteController();
                    $result = $clienteController->listarContas($userId);
                    echo json_encode(['success' => true, 'data' => $result]);
                } else {
                    throw new Exception("Método não permitido", 405);
                }
                break;
            case 'cliente/deposito':
                if($requestMethod == 'POST') {
                    $data = json_encode(file_get_contents('php://input'), true);
                    $clienteController = new ClienteController();
                    $result = $clienteController->realizarDeposito($data['id_conta'], $data['valor']);
                    echo json_encode(['success' => true, 'data' => $result]);
                } else {
                    throw new Exception("Método não permitido", 405);
                }
                break;
            case 'cliente/saque':
                if($requestMethod == 'POST') {
                    $data = json_encode(file_get_contents('php://input'), true);
                    $clienteController = new ClienteController();
                    $result = $clienteController->realizarSaque($data['id_conta'], $data['valor']);
                    echo json_encode(['success' => true, 'data' => $result]);
                } else {
                    throw new Exception("Método não permitido", 405);
                }
                break;
            case 'cliente/transferencia':
                if($requestMethod == 'POST') {
                    $data = json_encode(file_get_contents('php://input'), true);
                    $clienteController = new ClienteController();
                    $result = $clienteController->realizarTransferencia(
                        $data['id_conta_origem'],
                        $data['numero_conta_destino'],
                        $data['valor']
                    );
                    echo json_encode(['success' => true, 'data' => $result]);
                } else {
                    throw new Exception("Método não permitido", 405);
                }
                break;
            case 'cliente/extrato':
                if($requestMethod == 'GET') {
                    $clienteController = new ClienteController();
                    $result = $clienteController->obterExtrato(
                        $_GET['id_conta'],
                        $_GET['limite'] ?? 10
                    );
                    echo json_encode(['success' => true, 'data' => $result]);
                } else {
                    throw new Exception("Método não permitido", 405);
                }
                break;

            // Rotas do funcionário
            case "funcionario/cadastrar":
                if($requestMethod == 'POST' && $usertype == 'FUNCIONARIO') {
                    $data = json_encode(file_get_contents('php://input'), true);
                    $funcionarioController = new FuncionarioController();
                    $result = $funcionarioController->cadastrarFuncionario($data);
                    echo json_encode(['success' => true, 'data' => $result]);
                } else {
                    throw new Exception("Método não permitido ou acesso negado", 405);
                }
            case 'funcionario/clientes':
                if($requestMethod == 'GET' && $usertype == 'FUNCIONARIO') {
                    $funcionarioController = new FuncionarioController();
                    $result = $funcionarioController->listarClientes($_GET);
                    echo json_encode(['success' => true, 'data' => $result]);
                } else {
                    throw new Exception("Método não permitido ou acesso negado", 405);
                }
                break;
            case 'funcionario/conta/abrir':
                if($requestMethod == 'POST' && $usertype == 'FUNCIONARIO') {
                    $data = json_encode(file_get_contents('php://input'), true);
                    $contaController = new ContaController();
                    $result = $contaController->abrirConta(
                        $data['tipo'],
                        $data['id_agencia'],
                        $data['id_cliente'],
                        $data['dados_especificos']
                    );
                    echo json_encode(['success' => true, 'data' => $result]);
                } else {
                    throw new Exception("Método não permitido ou acesso negado", 405);
                }
                break;
            case 'funcionario/conta/encerrar':
                if($requestMethod == 'POST' && $usertype == 'FUNCIONARIO') {
                    $data = json_encode(file_get_contents('php://input'), true);
                    $contaController = new ContaController();
                    $result = $contaController->encerrarConta($data['numero_conta']);
                    echo json_encode(['success' => true, 'data' => $result]);
                } else {
                    throw new Exception("Método não permitido ou acesso negado", 405);
                }
                break;
            case 'funcionario/conta/bloquear':
                if($requestMethod == 'POST' && $usertype == 'FUNCIONARIO') {
                    $data = json_encode(file_get_contents('php://input'), true);
                    $contaController = new ContaController();
                    $result = $contaController->bloquearConta($data['numero_conta']);
                    echo json_encode(['success' => true, 'data' => $result]);
                } else {
                    throw new Exception("Método não permitido ou acesso negado", 405);
                }
                break;
            
            // Rota das Transações
            case 'transacoes':
                if($requestMethod == 'GET') {
                    $transacaoController = new TransacaoController();
                    $result = $transacaoController->listarTransacoes($_GET);
                    echo json_encode(['success' => true, 'data' => $result]);   
                } else {
                    throw new Exception("Método não permitido", 405);
                }
                break;
            case 'transacao/detalhes':
                if($requestMethod == 'GET') {
                    $transacaoController = new TransacaoController();
                    $result = $transacaoController->obterDetalhesTransacao($_GET['id_transacao']);
                    echo json_encode(['success' => true, 'data' => $result]);
                } else {
                    throw new Exception("Método não permitido", 405);
                }
                break;

            // Rota dos relatórios
            case 'relatorio/contas':
                if($requestMethod == 'GET' && $usertype == 'FUNCIONARIO') {
                    $relatorioController = new RelatorioController();
                    $result = $relatorioController->gerarRelatorioContas($userId);
                    echo json_encode(['success' => true, 'data' => $result]);
                } else {
                    throw new Exception("Método não permitido");
                }
                break;
            case 'relatorio/transacoes':
                if($requestMethod == 'GET' && $usertype == 'FUNCIONARIO') {
                    $relatorioController = new RelatorioController();
                    $result = $relatorioController->gerarRelatorioTransacoes(
                        $userId,
                        $_GET['data_inicio'],
                        $_GET['data_fim']
                    );
                    echo json_encode(['success' => true, 'data' => $result]);
                } else {
                    throw new Exception("Método não permitido ou acesso negado", 405);
                }
                break;
            case 'relatorios/gerar':
                if($requestMethod == 'GET' && $usertype == 'FUNCIONARIO') {
                    $relatorioController = new RelatorioController();
                    $result = $relatorioController->gerarRelatorioTransacoes(
                        $userId,
                        $_GET['data_inicio'],
                        $_GET['data_fim']
                    );
                    echo json_encode(['success' => true, 'data' => $result]);
                } else {
                    throw new Exception("Método não permitido ou acesso negado", 405);
                }
                break;
            case 'relatorios':
                if($requestMethod == 'GET' && $usertype == 'FUNCIONARIO') {
                    $relatorioController = new RelatorioController();
                    $result = $relatorioController->listarRelatorios($userId);
                    echo json_encode(['success' => true, 'data' => $result]);
                } else {
                    throw new Exception("Método não permitido ou acesso negado", 405);
                }
                break;

            // Rotas da Auditoria
            case 'auditoria':
                if($requestMethod == 'GET' && $usertype == 'FUNCIONARIO') {
                    $auditoriaController = new AuditoriaController();
                    $result = $auditoriaController->listarAuditoria($_GET);
                    echo json_encode(['success' => true, 'data' => $result]);
                } else {
                    throw new Exception("Método não permitido ou acesso negado", 405);
                }
                break;
            default:
                throw new Exception("Endpoint não encontrado", 404);
        }
    } catch(Exception $e) {
        http_response_code($e->getCode() ?: 500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
?>