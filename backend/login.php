<?php
// ============================================
// CONFIGURACIÓN DE HEADERS
// ============================================
// Permite que el navegador haga peticiones desde otro dominio/puerto
header('Access-Control-Allow-Origin: *');
// Indica que la respuesta será en formato JSON
header('Content-Type: application/json');
// Permite el método POST
header('Access-Control-Allow-Methods: POST');
// Permite enviar el header Content-Type
header('Access-Control-Allow-Headers: Content-Type');

// Si es una petición OPTIONS (preflight CORS), terminar aquí
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// ============================================
// RECIBIR DATOS DEL CLIENTE
// ============================================
// Leer el cuerpo de la petición (lo que envió JavaScript con fetch)
$json_recibido = file_get_contents('php://input');

// Convertir el JSON recibido a un array de PHP
$credenciales = json_decode($json_recibido, true);

// Extraer usuario y contraseña del array
$usuario_enviado = $credenciales['usuario'];
$password_enviada = $credenciales['password'];

// ============================================
// LEER ARCHIVO DE USUARIOS
// ============================================
// Leer el archivo usuarios.json completo
$contenido_usuarios = file_get_contents('usuarios.json');

// Convertir el JSON a array de PHP
$datos_usuarios = json_decode($contenido_usuarios, true);

// ============================================
// BUSCAR SI EL USUARIO EXISTE
// ============================================
// Variable para guardar el usuario si lo encontramos
$usuario_encontrado = null;

// Recorrer todos los usuarios del archivo
foreach ($datos_usuarios['usuarios'] as $usuario) {
    // Comparar usuario y contraseña
    if ($usuario['usuario'] === $usuario_enviado && 
        $usuario['password'] === $password_enviada) {
        // ¡Usuario encontrado!
        $usuario_encontrado = $usuario;
        break; // Salir del bucle
    }
}

// ============================================
// VERIFICAR SI SE ENCONTRÓ EL USUARIO
// ============================================
if ($usuario_encontrado === null) {
    // Credenciales incorrectas
    $respuesta = array(
        'exito' => false,
        'mensaje' => 'Usuario o contraseña incorrectos'
    );
    echo json_encode($respuesta);
    exit(); // Terminar aquí, no continuar
}

// ============================================
// LOGIN EXITOSO - GENERAR TOKEN
// ============================================
// Token fijo como pide el ejercicio (en producción sería único y temporal)
$token = 'TOKEN_SECRETO_12345';

// ============================================
// LEER INFORMACIÓN DE LA TIENDA
// ============================================
// Leer el archivo tienda.json
$contenido_tienda = file_get_contents('tienda.json');

// Convertir a array de PHP
$datos_tienda = json_decode($contenido_tienda, true);

// ============================================
// PREPARAR Y ENVIAR RESPUESTA EXITOSA
// ============================================
$respuesta = array(
    'exito' => true,
    'mensaje' => 'Login exitoso',
    'token' => $token,
    'usuario' => array(
        'id' => $usuario_encontrado['id'],
        'usuario' => $usuario_encontrado['usuario']
    ),
    'tienda' => $datos_tienda // Enviar toda la información de la tienda
);

// Convertir el array a JSON y enviarlo
echo json_encode($respuesta);
?>