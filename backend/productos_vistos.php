<?php
// ============================================
// CONFIGURACIÓN DE HEADERS
// ============================================
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// ============================================
// RECIBIR DATOS
// ============================================
$json_recibido = file_get_contents('php://input');
$datos = json_decode($json_recibido, true);

// Extraer token y productos vistos
$token_recibido = $datos['token'];
$productos_vistos = $datos['productos_vistos'];

// ============================================
// VALIDAR TOKEN
// ============================================
$TOKEN_VALIDO = 'TOKEN_SECRETO_12345';

if ($token_recibido !== $TOKEN_VALIDO) {
    $respuesta = array(
        'exito' => false,
        'mensaje' => 'Token inválido'
    );
    echo json_encode($respuesta);
    exit();
}

// ============================================
// RESPUESTA EXITOSA
// ============================================
// En este ejercicio solo validamos el token
// Podrías guardar estadísticas en un archivo o base de datos

$respuesta = array(
    'exito' => true,
    'mensaje' => 'Productos vistos registrados correctamente',
    'cantidad' => count($productos_vistos)
);

echo json_encode($respuesta);
?>
