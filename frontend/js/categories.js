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
    // VERIFICAR SI HAY UNA CATEGORÍA SELECCIONADA
    // ============================================
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idCategoria = urlParams.get('id');
    
    if (idCategoria) {
        // Si hay ID de categoría, mostrar productos de esa categoría
        cargarProductosCategoria(idCategoria);
    } else {
        // Si no hay ID, mostrar todas las categorías
        cargarTodasCategorias();
    }
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
// FUNCIÓN: Cargar todas las categorías
// ============================================
function cargarTodasCategorias() {
    const categorias = obtenerCategorias();
    const contenedor = document.getElementById('lista-categorias');
    
    if (!contenedor) {
        return;
    }
    
    contenedor.innerHTML = '';
    
    if (categorias.length === 0) {
        contenedor.innerHTML = '<p>No hay categorías disponibles</p>';
        return;
    }
    
    // Crear tarjeta para cada categoría
    categorias.forEach(categoria => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-categoria';
        
        tarjeta.innerHTML = `
            <h3>${categoria.nombre}</h3>
            <p>${categoria.descripcion}</p>
            <a href="categories.html?id=${categoria.id}" class="btn">
                Ver Productos
            </a>
        `;
        
        contenedor.appendChild(tarjeta);
    });
}

// ============================================
// FUNCIÓN: Cargar productos de una categoría específica
// ============================================
function cargarProductosCategoria(idCategoria) {
    // Obtener la categoría
    const categorias = obtenerCategorias();
    const categoria = categorias.find(cat => cat.id === parseInt(idCategoria));
    
    if (!categoria) {
        alert('Categoría no encontrada');
        window.location.href = 'categories.html';
        return;
    }
    
    // Mostrar el nombre de la categoría
    const nombreCategoria = document.getElementById('nombre-categoria');
    if (nombreCategoria) {
        nombreCategoria.textContent = categoria.nombre;
    }
    
    // Obtener productos de esta categoría
    const productos = obtenerProductosPorCategoria(idCategoria);
    
    // Mostrar la sección de productos
    const seccionProductos = document.getElementById('seccion-productos-categoria');
    if (seccionProductos) {
        seccionProductos.style.display = 'block';
    }
    
    const contenedor = document.getElementById('productos-categoria');
    
    if (!contenedor) {
        return;
    }
    
    contenedor.innerHTML = '';
    
    if (productos.length === 0) {
        contenedor.innerHTML = '<p>No hay productos en esta categoría</p>';
        return;
    }
    
    // Crear tarjeta para cada producto
    productos.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-producto';
        
        tarjeta.innerHTML = `
            <img src="images/${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
            <h3>${producto.nombre}</h3>
            <p class="producto-descripcion">${producto.descripcion}</p>
            <p class="producto-precio">${formatearPrecio(producto.precio)}</p>
            <button onclick="agregarAlCarrito(${producto.id}); actualizarContadorCarrito();" class="btn-agregar">
                Añadir al carrito
            </button>
            <a href="product.html?id=${producto.id}" class="btn-ver-detalle">Ver detalles</a>
        `;
        
        contenedor.appendChild(tarjeta);
    });
    
    // También mostrar lista de categorías arriba
    cargarTodasCategorias();
}