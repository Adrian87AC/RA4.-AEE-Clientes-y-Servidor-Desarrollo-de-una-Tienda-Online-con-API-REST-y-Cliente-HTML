// ============================================
// ESPERAR A QUE EL DOM ESTÉ CARGADO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // VERIFICAR AUTENTICACIÓN
    // ============================================
    if (!verificarAutenticacion()) {
        return; // Si no está autenticado, la función ya redirige
    }
    
    // ============================================
    // CARGAR INFORMACIÓN DEL USUARIO
    // ============================================
    cargarInfoUsuario();
    
    // ============================================
    // CARGAR PRODUCTOS DESTACADOS
    // ============================================
    cargarProductosDestacados();
    
    // ============================================
    // CARGAR CATEGORÍAS
    // ============================================
    cargarCategorias();
    
    // ============================================
    // ACTUALIZAR CONTADOR DEL CARRITO
    // ============================================
    actualizarContadorCarrito();
    
    // ============================================
    // CONFIGURAR BOTÓN DE CERRAR SESIÓN
    // ============================================
    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', cerrarSesion);
    }
});

// ============================================
// FUNCIÓN: Cargar información del usuario
// ============================================
function cargarInfoUsuario() {
    const usuarioJSON = localStorage.getItem('usuario');
    
    if (usuarioJSON) {
        const usuario = JSON.parse(usuarioJSON);
        
        // Mostrar el nombre del usuario en el dashboard
        const nombreUsuario = document.getElementById('nombre-usuario');
        if (nombreUsuario) {
            nombreUsuario.textContent = usuario.usuario;
        }
    }
}

// ============================================
// FUNCIÓN: Cargar productos destacados
// ============================================
function cargarProductosDestacados() {
    // Obtener productos destacados desde utils.js
    const productosDestacados = obtenerProductosDestacados();
    
    // Obtener el contenedor donde mostraremos los productos
    const contenedor = document.getElementById('productos-destacados');
    
    if (!contenedor) {
        return;
    }
    
    // Limpiar el contenedor
    contenedor.innerHTML = '';
    
    // Si no hay productos destacados
    if (productosDestacados.length === 0) {
        contenedor.innerHTML = '<p>No hay productos destacados</p>';
        return;
    }
    
    // ============================================
    // CREAR TARJETA PARA CADA PRODUCTO
    // ============================================
    productosDestacados.forEach(producto => {
        // Crear el div de la tarjeta
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-producto';
        
        // Contenido HTML de la tarjeta
        tarjeta.innerHTML = `
            <img src="images/${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
            <h3>${producto.nombre}</h3>
            <p class="producto-descripcion">${producto.descripcion}</p>
            <p class="producto-precio">${formatearPrecio(producto.precio)}</p>
            <button onclick="agregarAlCarrito(${producto.id})" class="btn-agregar">
                Añadir al carrito
            </button>
            <a href="product.html?id=${producto.id}" class="btn-ver-detalle">Ver detalles</a>
        `;
        
        // Añadir la tarjeta al contenedor
        contenedor.appendChild(tarjeta);
    });
}

// ============================================
// FUNCIÓN: Cargar categorías
// ============================================
function cargarCategorias() {
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
    
    // Crear un enlace para cada categoría
    categorias.forEach(categoria => {
        const enlace = document.createElement('a');
        enlace.href = `categories.html?id=${categoria.id}`;
        enlace.className = 'categoria-item';
        enlace.textContent = categoria.nombre;
        
        contenedor.appendChild(enlace);
    });
}

// ============================================
// FUNCIÓN: Actualizar contador del carrito
// ============================================
function actualizarContadorCarrito() {
    const cantidad = contarProductosCarrito();
    
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        contador.textContent = cantidad;
        
        // Mostrar u ocultar el contador
        if (cantidad > 0) {
            contador.style.display = 'inline-block';
        } else {
            contador.style.display = 'none';
        }
    }
}