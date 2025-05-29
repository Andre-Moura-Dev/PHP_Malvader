<?php
    require_once __DIR__ . '/../config/config.php';
    use Firebase\JWT\JWT;
    use Firebase\JWT\Key;

    class Auth {
        public static function generateToken($userId, $userType) {
            $config = config()['jwt'];
            $payload = [
                'iat' => time(),
                'exp' => time() + $config['expiration'],
                'sub' => $userId,
                'type' => $userType
            ];
            return JWT::encode($payload, $config['secret'], $config['algorithm']);
        }

        public static function validateToken($token) {
            $config = config()['jwt'];

            try {
                $decoded = JWT::decode($token, new Key($config['secret'], $config['algorithm']));
                return (array) $decoded;
            } catch(Exception $e) {
                return false;
            }
        }
    }
?>