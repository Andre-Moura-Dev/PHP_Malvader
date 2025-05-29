<?php
    require_once __DIR__ . '/../config/config.php';

    class Database {
        private static $instance = null;
        private $connection;

        private function __construct() {
            $config = config()['db'];
            $dsn = "mysql:host={$config['host']};
            dbname={$config['dbname']};
            charset={$config['charset']}";

            try {
                $this->connection = new PDO($dsn, $config['user'], $config['pass']);
                $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                throw new Exception("Falha na conexão com o banco de dados: " . $e->getMessage());
            }
        }

        public static function getInstance() {
            if(!self::$instance) {
                self::$instance = new Database();
            }
            return self::$instance->connection;
        }
    }
?>