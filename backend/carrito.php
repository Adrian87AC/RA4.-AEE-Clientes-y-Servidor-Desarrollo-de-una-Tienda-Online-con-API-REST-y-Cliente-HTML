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
// RECIBIR DATOS DEL CLIENTE
// ============================================
// Leer el JSON enviado desde JavaScript
$json_recibido = file_get_contents('php://input');

// Convertir a array de PHP
$datos = json_decode($json_recibido, true);

// Extraer el token y el carrito
$token_recibido = $datos['token'];
$carrito = $datos['carrito'];

// ============================================
// VALIDAR EL TOKEN
// ============================================
// El token válido (el mismo que generamos en login.php)
$TOKEN_VALIDO = 'TOKEN_SECRETO_12345';

// Verificar que el token sea correcto
if ($token_recibido !== $TOKEN_VALIDO) {
    // Token inválido - usuario no autorizado
    $respuesta = array(
        'exito' => false,
        'mensaje' => 'Token inválido. Acceso no autorizado.'
    );
    echo json_encode($respuesta);
    exit(); // Terminar aquí
}

// ============================================
// LEER PRECIOS REALES DE LA TIENDA
// ============================================
// Leer el archivo tienda.json
$contenido_tienda = file_get_contents('tienda.json');

// Convertir a array de PHP
$datos_tienda = json_decode($contenido_tienda, true);

// Extraer solo el array de productos
$productos_reales = $datos_tienda['productos'];

// ============================================
// CREAR MAPA DE PRECIOS (para búsqueda rápida)
// ============================================
// Array asociativo: id => precio
$mapa_precios = array();

foreach ($productos_reales as $producto) {
    $id = $producto['id'];
    $precio = $producto['precio'];
    // Guardar: $mapa_precios[1] = 899.99
    $mapa_precios[$id] = $precio;
}

// ============================================
// VALIDAR CADA PRODUCTO DEL CARRITO
// ============================================
$total_real = 0; // Calcular el total correcto

foreach ($carrito as $item) {
    // Extraer datos del producto en el carrito
    $id_producto = $item['id'];
    $precio_enviado = $item['precio'];
    $cantidad = $item['cantidad'];
    
    // Verificar que el producto existe en la tienda
    if (!isset($mapa_precios[$id_producto])) {
        // El producto no existe - posible manipulación
        $respuesta = array(
            'exito' => false,
            'mensaje' => 'El producto con ID ' . $id_producto . ' no existe en la tienda'
        );
        echo json_encode($respuesta);
        exit();
    }
    
    // Obtener el precio real del producto
    $precio_real = $mapa_precios[$id_producto];
    
    // Comparar el precio enviado con el precio real
    // Usamos abs() y 0.01 para evitar problemas con decimales
    if (abs($precio_enviado - $precio_real) > 0.01) {
        // ¡MANIPULACIÓN DETECTADA!
        $respuesta = array(
            'exito' => false,
            'mensaje' => 'Precio manipulado detectado',
            'producto_id' => $id_producto,
            'precio_enviado' => $precio_enviado,
            'precio_real' => $precio_real
        );
        echo json_encode($respuesta);
        exit();
    }
    
    // Calcular el subtotal con el precio REAL (no el enviado)
    $total_real += ($precio_real * $cantidad);
}

// ============================================
// TODO CORRECTO - CARRITO VALIDADO
// ============================================
$respuesta = array(
    'exito' => true,
    'mensaje' => 'Carrito validado correctamente',
    'total' => round($total_real, 2), // Redondear a 2 decimales
    'productos_validados' => count($carrito)
);

echo json_encode($respuesta);
?>