// ============================================
// ESPERAR A QUE EL DOM ESTÉ CARGADO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // VERIFICAR SI YA HAY SESIÓN INICIADA
    // ============================================
    const token = localStorage.getItem('token');
    if (token) {
        // Si ya hay token, redirigir al dashboard
        window.location.href = 'dashboard.html';
        return;
    }
    
    // ============================================
    // OBTENER EL FORMULARIO
    // ============================================
    const formulario = document.getElementById('form-login');
    
    // ============================================
    // MANEJAR EL ENVÍO DEL FORMULARIO
    // ============================================
    formulario.addEventListener('submit', function(evento) {
        // Prevenir que el formulario se envíe de forma tradicional
        evento.preventDefault();
        
        // Obtener los valores de los inputs
        const usuario = document.getElementById('usuario').value;
        const password = document.getElementById('password').value;
        
        // Validación básica
        if (!usuario || !password) {
            mostrarError('Por favor, completa todos los campos');
            return;
        }
        
        // Mostrar mensaje de carga
        mostrarCargando();
        
        // ============================================
        // ENVIAR PETICIÓN AL SERVIDOR
        // ============================================
        fetch(API_URL + 'login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario: usuario,
                password: password
            })
        })
        .then(response => {
            // Verificar que la respuesta sea exitosa
            if (!response.ok) {
                throw new Error('Error en la petición');
            }
            // Convertir la respuesta a JSON
            return response.json();
        })
        .then(data => {
            // ============================================
            // PROCESAR LA RESPUESTA
            // ============================================
            if (data.exito) {
                // Login exitoso
                
                // Guardar el token
                localStorage.setItem('token', data.token);
                
                // Guardar la información de la tienda
                localStorage.setItem('tienda', JSON.stringify(data.tienda));
                
                // Guardar información del usuario (opcional)
                localStorage.setItem('usuario', JSON.stringify(data.usuario));
                
                // Inicializar carrito vacío si no existe
                if (!localStorage.getItem('carrito')) {
                    localStorage.setItem('carrito', JSON.stringify([]));
                }
                
                // Inicializar productos vistos vacío si no existe
                if (!localStorage.getItem('productos_vistos')) {
                    localStorage.setItem('productos_vistos', JSON.stringify([]));
                }
                
                // Mostrar mensaje de éxito
                mostrarExito('Login exitoso. Redirigiendo...');
                
                // Redirigir al dashboard después de 1 segundo
                setTimeout(function() {
                    window.location.href = 'dashboard.html';
                }, 1000);
                
            } else {
                // Login fallido
                mostrarError(data.mensaje || 'Credenciales incorrectas');
            }
        })
        .catch(error => {
            // Error en la conexión o en el servidor
            console.error('Error:', error);
            mostrarError('Error al conectar con el servidor. Verifica que el backend esté funcionando.');
        });
    });
});

// ============================================
// FUNCIONES AUXILIARES PARA MENSAJES
// ============================================

function mostrarError(mensaje) {
    const divMensaje = document.getElementById('mensaje');
    divMensaje.className = 'mensaje error';
    divMensaje.textContent = mensaje;
    divMensaje.style.display = 'block';
}

function mostrarExito(mensaje) {
    const divMensaje = document.getElementById('mensaje');
    divMensaje.className = 'mensaje exito';
    divMensaje.textContent = mensaje;
    divMensaje.style.display = 'block';
}

function mostrarCargando() {
    const divMensaje = document.getElementById('mensaje');
    divMensaje.className = 'mensaje cargando';
    divMensaje.textContent = 'Iniciando sesión...';
    divMensaje.style.display = 'block';
}