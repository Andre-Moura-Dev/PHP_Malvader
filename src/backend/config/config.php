<?php
    return [
        'db' => [
            'host' => getenv('DB_HOST') ?: 'localhost',
            'name' => getenv('DB_NAME') ?: 'banco_malvader',
            'user' => getenv('DB_USER') ?: 'root',
            'pass' => getenv('DB_PASS') ?: 'PYTHON66@java',
            'charset' => 'utf8mb4'
        ],
        'jwt' => [
            'secret' => getenv('JWT_SECRET') ?: 'malvader_secret_key',
            'algorithm' => 'HS256',
            'expiration' => 3600 // 1 hora
        ],
        'otp' => [
            'expiration' => 300 // 5 minutos
        ]
    ]
?>