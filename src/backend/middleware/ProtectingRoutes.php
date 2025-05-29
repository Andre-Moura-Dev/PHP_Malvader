<?php
    // Endpoints Gerados:

    // Clientes
    $dadosUsuario = Auth::middlewareAutenticacao('CLIENTE');

    // Funcionários
    $dadosUsuario = Auth::middlewareAutenticacao('FUNCIONARIO');

    // Autenticação
    $dadosUsuario = Auth::middlewareAutenticacao();
?>