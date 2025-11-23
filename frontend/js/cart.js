// ============================================
// ESPERAR A QUE EL DOM ESTÉ CARGADO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    
    // Verificar autenticación
    if (!verificarAutenticacion()) {
        return;
    }
    
    // Cargar el carrito
    cargarCarrito();
    
    // Configurar botón de finalizar compra
    const btnFinalizarCompra = document.getElementById('btn-finalizar-compra');
    if (btnFinalizarCompra) {
        btnFinalizarCompra.addEventListener('click', finalizarCompra);
    }
    
    // Configurar botón de vaciar carrito
    const btnVaciarCarrito = document.getElementById('btn-vaciar-carrito');
    if (btnVaciarCarrito) {
        btnVaciarCarrito.addEventListener('click', function() {
            if (confirm('¿Estás seguro de vaciar el carrito?')) {
                vaciarCarrito();
                cargarCarrito(); // Recargar la vista
            }
        });
    }
});

// ============================================
// FUNCIÓN: Cargar y mostrar el carrito
// ============================================
function cargarCarrito() {
    const carrito = obtenerCarrito();
    
    const contenedor = document.getElementById('items-carrito');
    const totalElement = document.getElementById('total-carrito');
    const btnFinalizarCompra = document.getElementById('btn-finalizar-compra');
    
    if (!contenedor) {
        return;
    }
    
    // Limpiar contenedor
    contenedor.innerHTML = '';
    
    // ============================================
    // SI EL CARRITO ESTÁ VACÍO
    // ============================================
    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="carrito-vacio">
                <p>Tu carrito está vacío</p>
                <a href="dashboard.html" class="btn">Ir a la tienda</a>
            </div>
        `;
        totalElement.textContent = '0.00 €';
        if (btnFinalizarCompra) {
            btnFinalizarCompra.disabled = true;
        }
        return;
    }
    
    // ============================================
    // CREAR FILA PARA CADA PRODUCTO
    // ============================================
    carrito.forEach(item => {
        const fila = document.createElement('div');
        fila.className = 'item-carrito';
        
        const subtotal = (item.precio * item.cantidad).toFixed(2);
        
        fila.innerHTML = `
            <img src="images/${item.imagen}" alt="${item.nombre}" class="item-imagen">
            <div class="item-info">
                <h3>${item.nombre}</h3>
                <p class="item-precio">${formatearPrecio(item.precio)}</p>
            </div>
            <div class="item-cantidad">
                <label>Cantidad:</label>
                <input type="number" 
                       value="${item.cantidad}" 
                       min="1" 
                       max="99"
                       onchange="actualizarCantidad(${item.id}, this.value); cargarCarrito();">
            </div>
            <div class="item-subtotal">
                <p>Subtotal: ${subtotal} €</p>
            </div>
            <button onclick="eliminarDelCarrito(${item.id}); cargarCarrito();" 
                    class="btn-eliminar">
                Eliminar
            </button>
        `;
        
        contenedor.appendChild(fila);
    });
    
    // ============================================
    // CALCULAR Y MOSTRAR TOTAL
    // ============================================
    const total = calcularTotalCarrito();
    totalElement.textContent = total + ' €';
    
    // Habilitar botón de finalizar compra
    if (btnFinalizarCompra) {
        btnFinalizarCompra.disabled = false;
    }
}

// ============================================
// FUNCIÓN: Finalizar compra
// ============================================
function finalizarCompra() {
    const carrito = obtenerCarrito();
    
    // Validar que haya productos
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    // Obtener el token
    const token = obtenerToken();
    
    // Mostrar mensaje de procesando
    const btnFinalizarCompra = document.getElementById('btn-finalizar-compra');
    if (btnFinalizarCompra) {
        btnFinalizarCompra.disabled = true;
        btnFinalizarCompra.textContent = 'Procesando...';
    }
    
    // ============================================
    // ENVIAR CARRITO AL SERVIDOR PARA VALIDACIÓN
    // ============================================
    fetch(API_URL + 'carrito.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: token,
            carrito: carrito
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.exito) {
            // ============================================
            // COMPRA EXITOSA
            // ============================================
            alert(`¡Compra realizada con éxito!\nTotal: ${data.total} €`);
            
            // Vaciar el carrito
            vaciarCarrito();
            
            // Redirigir al dashboard
            window.location.href = 'dashboard.html';
            
        } else {
            // ============================================
            // ERROR EN LA VALIDACIÓN
            // ============================================
            alert('Error: ' + data.mensaje);
            
            // Recargar la página por si hubo manipulación
            location.reload();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al procesar la compra. Inténtalo de nuevo.');
    })
    .finally(() => {
        // Restaurar botón
        if (btnFinalizarCompra) {
            btnFinalizarCompra.disabled = false;
            btnFinalizarCompra.textContent = 'Finalizar Compra';
        }
    });
}