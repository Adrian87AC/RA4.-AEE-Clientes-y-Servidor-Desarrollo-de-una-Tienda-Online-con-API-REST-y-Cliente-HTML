// ============================================
// ESPERAR A QUE EL DOM ESTÉ CARGADO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    
    // Verificar autenticación
    if (!verificarAutenticacion()) {
        return;
    }
    
    // Cargar información del usuario
    cargarInfoUsuario();
    
    // Actualizar contador del carrito
    actualizarContadorCarrito();
    
    // Configurar botón de cerrar sesión
    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', cerrarSesion);
    }
    
    // ============================================
    // OBTENER ID DEL PRODUCTO DE LA URL
    // ============================================
    const urlParams = new URLSearchParams(window.location.search);
    const idProducto = urlParams.get('id');
    
    if (!idProducto) {
        alert('Producto no especificado');
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Cargar el producto
    cargarProducto(idProducto);
    
    // Registrar como producto visto
    agregarProductoVisto(idProducto);
    
    // Cargar productos relacionados
    cargarProductosRelacionados(idProducto);
});

// ============================================
// FUNCIÓN: Cargar información del usuario
// ============================================
function cargarInfoUsuario() {
    const usuarioJSON = localStorage.getItem('usuario');
    
    if (usuarioJSON) {
        const usuario = JSON.parse(usuarioJSON);
        const nombreUsuario = document.getElementById('nombre-usuario');
        if (nombreUsuario) {
            nombreUsuario.textContent = usuario.usuario;
        }
    }
}

// ============================================
// FUNCIÓN: Actualizar contador del carrito
// ============================================
function actualizarContadorCarrito() {
    const cantidad = contarProductosCarrito();
    const contador = document.getElementById('contador-carrito');
    
    if (contador) {
        contador.textContent = cantidad;
        contador.style.display = cantidad > 0 ? 'inline-block' : 'none';
    }
}

// ============================================
// FUNCIÓN: Cargar y mostrar el producto
// ============================================
function cargarProducto(idProducto) {
    // Obtener el producto
    const producto = obtenerProductoPorId(idProducto);
    
    const contenedor = document.getElementById('detalle-producto');
    
    if (!contenedor) {
        return;
    }
    
    if (!producto) {
        contenedor.innerHTML = `
            <div class="error">
                <p>Producto no encontrado</p>
                <a href="dashboard.html" class="btn">Volver al inicio</a>
            </div>
        `;
        return;
    }
    
    // Actualizar breadcrumb
    const breadcrumb = document.getElementById('breadcrumb-producto');
    if (breadcrumb) {
        breadcrumb.textContent = producto.nombre;
    }
    
    // Crear el HTML del detalle del producto
    contenedor.innerHTML = `
        <div class="producto-imagen-grande">
            <img src="images/${producto.imagen}" alt="${producto.nombre}">
        </div>
        
        <div class="producto-info-detalle">
            <h1>${producto.nombre}</h1>
            
            ${producto.destacado ? '<span class="badge-destacado">Destacado</span>' : ''}
            
            <p class="producto-precio-grande">${formatearPrecio(producto.precio)}</p>
            
            <p class="producto-descripcion-completa">${producto.descripcion}</p>
            
            <div class="producto-acciones">
                <button onclick="agregarAlCarrito(${producto.id}); actualizarContadorCarrito();" 
                        class="btn btn-primary btn-grande">
                    Añadir al Carrito
                </button>
                
                <button onclick="window.history.back();" class="btn btn-secondary">
                    Volver
                </button>
            </div>
            
            <div class="producto-detalles">
                <h3>Detalles del Producto</h3>
                <ul>
                    <li><strong>ID:</strong> ${producto.id}</li>
                    <li><strong>Categoría:</strong> ${obtenerNombreCategoria(producto.id_categoria)}</li>
                    <li><strong>Precio:</strong> ${formatearPrecio(producto.precio)}</li>
                </ul>
            </div>
        </div>
    `;
}

// ============================================
// FUNCIÓN: Obtener nombre de categoría por ID
// ============================================
function obtenerNombreCategoria(idCategoria) {
    const categorias = obtenerCategorias();
    const categoria = categorias.find(cat => cat.id === idCategoria);
    return categoria ? categoria.nombre : 'Sin categoría';
}

// ============================================
// FUNCIÓN: Cargar productos relacionados
// ============================================
function cargarProductosRelacionados(idProducto) {
    const producto = obtenerProductoPorId(idProducto);
    
    if (!producto) {
        return;
    }
    
    // Obtener productos de la misma categoría (excepto el actual)
    const productosRelacionados = obtenerProductosPorCategoria(producto.id_categoria)
        .filter(p => p.id !== parseInt(idProducto))
        .slice(0, 4); // Máximo 4 productos
    
    const contenedor = document.getElementById('productos-relacionados');
    
    if (!contenedor) {
        return;
    }
    
    contenedor.innerHTML = '';
    
    if (productosRelacionados.length === 0) {
        contenedor.innerHTML = '<p>No hay productos relacionados</p>';
        return;
    }
    
    // Crear tarjeta para cada producto relacionado
    productosRelacionados.forEach(prod => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-producto';
        
        tarjeta.innerHTML = `
            <img src="images/${prod.imagen}" alt="${prod.nombre}" class="producto-imagen">
            <h3>${prod.nombre}</h3>
            <p class="producto-precio">${formatearPrecio(prod.precio)}</p>
            <a href="product.html?id=${prod.id}" class="btn">Ver detalles</a>
        `;
        
        contenedor.appendChild(tarjeta);
    });
}