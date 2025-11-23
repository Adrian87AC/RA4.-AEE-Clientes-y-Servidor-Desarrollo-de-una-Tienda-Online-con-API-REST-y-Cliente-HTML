// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================
// URL base de tu backend PHP (ajusta según tu servidor)
const API_URL = 'http://localhost/proyecto-tienda/backend/';

// ============================================
// FUNCIÓN: Verificar si el usuario está autenticado
// ============================================
function verificarAutenticacion() {
    // Intentar obtener el token del localStorage
    const token = localStorage.getItem('token');
    
    // Si no hay token, el usuario no ha iniciado sesión
    if (!token) {
        // Redirigir al login
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

// ============================================
// FUNCIÓN: Obtener el token almacenado
// ============================================
function obtenerToken() {
    return localStorage.getItem('token');
}

// ============================================
// FUNCIÓN: Obtener datos de la tienda del localStorage
// ============================================
function obtenerTienda() {
    // Obtener el JSON de la tienda
    const tiendaJSON = localStorage.getItem('tienda');
    
    // Si no existe, retornar null
    if (!tiendaJSON) {
        return null;
    }
    
    // Convertir el texto JSON a objeto JavaScript
    return JSON.parse(tiendaJSON);
}

// ============================================
// FUNCIÓN: Obtener todos los productos
// ============================================
function obtenerProductos() {
    const tienda = obtenerTienda();
    
    // Si no hay tienda, retornar array vacío
    if (!tienda) {
        return [];
    }
    
    return tienda.productos;
}

// ============================================
// FUNCIÓN: Obtener todas las categorías
// ============================================
function obtenerCategorias() {
    const tienda = obtenerTienda();
    
    if (!tienda) {
        return [];
    }
    
    return tienda.categorias;
}

// ============================================
// FUNCIÓN: Obtener un producto por su ID
// ============================================
function obtenerProductoPorId(id) {
    const productos = obtenerProductos();
    
    // Buscar el producto con el ID especificado
    // find() retorna el primer elemento que cumpla la condición
    return productos.find(producto => producto.id === parseInt(id));
}

// ============================================
// FUNCIÓN: Obtener productos de una categoría
// ============================================
function obtenerProductosPorCategoria(idCategoria) {
    const productos = obtenerProductos();
    
    // filter() retorna todos los elementos que cumplan la condición
    return productos.filter(producto => producto.id_categoria === parseInt(idCategoria));
}

// ============================================
// FUNCIÓN: Obtener productos destacados
// ============================================
function obtenerProductosDestacados() {
    const productos = obtenerProductos();
    
    // Filtrar solo los que tienen destacado = true
    return productos.filter(producto => producto.destacado === true);
}

// ============================================
// GESTIÓN DEL CARRITO
// ============================================

// FUNCIÓN: Obtener el carrito del localStorage
function obtenerCarrito() {
    const carritoJSON = localStorage.getItem('carrito');
    
    // Si no existe carrito, retornar array vacío
    if (!carritoJSON) {
        return [];
    }
    
    return JSON.parse(carritoJSON);
}

// FUNCIÓN: Guardar el carrito en localStorage
function guardarCarrito(carrito) {
    // Convertir el array a JSON y guardarlo
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// FUNCIÓN: Añadir producto al carrito
function agregarAlCarrito(idProducto) {
    // Obtener el producto completo
    const producto = obtenerProductoPorId(idProducto);
    
    if (!producto) {
        alert('Producto no encontrado');
        return;
    }
    
    // Obtener el carrito actual
    const carrito = obtenerCarrito();
    
    // Buscar si el producto ya está en el carrito
    const productoExistente = carrito.find(item => item.id === producto.id);
    
    if (productoExistente) {
        // Si ya existe, aumentar la cantidad
        productoExistente.cantidad += 1;
    } else {
        // Si no existe, añadirlo con cantidad 1
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });
    }
    
    // Guardar el carrito actualizado
    guardarCarrito(carrito);
    
    alert('Producto añadido al carrito');
}

// FUNCIÓN: Eliminar producto del carrito
function eliminarDelCarrito(idProducto) {
    let carrito = obtenerCarrito();
    
    // Filtrar para quedarnos con todos EXCEPTO el que queremos eliminar
    carrito = carrito.filter(item => item.id !== parseInt(idProducto));
    
    guardarCarrito(carrito);
}

// FUNCIÓN: Actualizar cantidad de un producto en el carrito
function actualizarCantidad(idProducto, nuevaCantidad) {
    const carrito = obtenerCarrito();
    
    // Buscar el producto en el carrito
    const producto = carrito.find(item => item.id === parseInt(idProducto));
    
    if (producto) {
        // Actualizar la cantidad
        producto.cantidad = parseInt(nuevaCantidad);
        
        // Si la cantidad es 0 o negativa, eliminar el producto
        if (producto.cantidad <= 0) {
            eliminarDelCarrito(idProducto);
        } else {
            guardarCarrito(carrito);
        }
    }
}

// FUNCIÓN: Vaciar todo el carrito
function vaciarCarrito() {
    localStorage.removeItem('carrito');
}

// FUNCIÓN: Calcular el total del carrito
function calcularTotalCarrito() {
    const carrito = obtenerCarrito();
    let total = 0;
    
    // Sumar el precio * cantidad de cada producto
    carrito.forEach(item => {
        total += (item.precio * item.cantidad);
    });
    
    // Redondear a 2 decimales
    return total.toFixed(2);
}

// FUNCIÓN: Contar productos en el carrito
function contarProductosCarrito() {
    const carrito = obtenerCarrito();
    let cantidad = 0;
    
    // Sumar todas las cantidades
    carrito.forEach(item => {
        cantidad += item.cantidad;
    });
    
    return cantidad;
}

// ============================================
// PRODUCTOS VISTOS RECIENTEMENTE
// ============================================

// FUNCIÓN: Obtener productos vistos
function obtenerProductosVistos() {
    const vistosJSON = localStorage.getItem('productos_vistos');
    
    if (!vistosJSON) {
        return [];
    }
    
    return JSON.parse(vistosJSON);
}

// FUNCIÓN: Añadir producto a vistos recientemente
function agregarProductoVisto(idProducto) {
    let vistos = obtenerProductosVistos();
    
    // Eliminar el producto si ya estaba (para ponerlo al principio)
    vistos = vistos.filter(id => id !== parseInt(idProducto));
    
    // Añadir al principio del array
    vistos.unshift(parseInt(idProducto));
    
    // Mantener solo los últimos 10 productos vistos
    if (vistos.length > 10) {
        vistos = vistos.slice(0, 10);
    }
    
    // Guardar
    localStorage.setItem('productos_vistos', JSON.stringify(vistos));
}

// ============================================
// FUNCIÓN: Cerrar sesión
// ============================================
function cerrarSesion() {
    // Eliminar TODOS los datos del localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('tienda');
    localStorage.removeItem('carrito');
    localStorage.removeItem('productos_vistos');
    
    // Redirigir al login
    window.location.href = 'login.html';
}

// ============================================
// FUNCIÓN: Formatear precio
// ============================================
function formatearPrecio(precio) {
    // Convertir a número y formatear con 2 decimales
    return parseFloat(precio).toFixed(2) + ' €';
}