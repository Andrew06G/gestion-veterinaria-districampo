/**
 * Script principal de utilidades para Veterilab
 * Funciones comunes utilizadas en múltiples páginas
 */

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
  const alertClass = type === 'error' ? 'alert-danger' : 
                    type === 'success' ? 'alert-success' : 
                    type === 'warning' ? 'alert-warning' : 'alert-info';
  
  const alertHtml = `
    <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  `;
  
  // Crear contenedor de notificaciones si no existe
  let notificationContainer = document.getElementById('notification-container');
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    notificationContainer.style.position = 'fixed';
    notificationContainer.style.top = '20px';
    notificationContainer.style.right = '20px';
    notificationContainer.style.zIndex = '9999';
    document.body.appendChild(notificationContainer);
  }
  
  // Agregar notificación
  const alertElement = document.createElement('div');
  alertElement.innerHTML = alertHtml;
  notificationContainer.appendChild(alertElement);
  
  // Auto-remover después de 5 segundos
  setTimeout(() => {
    if (alertElement.parentNode) {
      alertElement.parentNode.removeChild(alertElement);
    }
  }, 5000);
}

// Función para validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Función para validar teléfono
function isValidPhone(phone) {
  const phoneRegex = /^\d{7,15}$/;
  return phoneRegex.test(phone);
}

// Función para sanitizar entrada de texto
function sanitizeInput(input) {
  return input.trim().replace(/[<>]/g, '');
}

// Función para formatear fecha
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Función para formatear moneda
function formatCurrency(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(amount);
}

// Función para hacer peticiones HTTP con manejo de errores
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en petición HTTP:', error);
    throw error;
  }
}

// Función para verificar si el usuario está autenticado
function isAuthenticated() {
  const token = localStorage.getItem('token');
  return token && token.length > 0;
}

// Función para redirigir si no está autenticado
function requireAuth(redirectUrl = '/login') {
  if (!isAuthenticated()) {
    window.location.href = redirectUrl;
    return false;
  }
  return true;
}

// Función para cerrar sesión
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

// Función para obtener datos del usuario actual
function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Error parsing user data:', e);
      return null;
    }
  }
  return null;
}

// Función para mostrar/ocultar spinner de carga
function showSpinner(show = true) {
  let spinner = document.getElementById('loading-spinner');
  
  if (!spinner) {
    spinner = document.createElement('div');
    spinner.id = 'loading-spinner';
    spinner.innerHTML = `
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Cargando...</span>
      </div>
    `;
    spinner.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 9999;
      background: rgba(255, 255, 255, 0.9);
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    `;
    document.body.appendChild(spinner);
  }
  
  spinner.style.display = show ? 'block' : 'none';
}

// Función para validar formularios
function validateForm(formElement) {
  const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.classList.add('is-invalid');
      isValid = false;
    } else {
      input.classList.remove('is-invalid');
    }
  });
  
  return isValid;
}

// Función para limpiar formularios
function clearForm(formElement) {
  formElement.reset();
  formElement.querySelectorAll('.is-invalid').forEach(input => {
    input.classList.remove('is-invalid');
  });
}

// Función para confirmar acciones
function confirmAction(message, callback) {
  if (confirm(message)) {
    callback();
  }
}

// Función para generar ID único
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Función para debounce (útil para búsquedas en tiempo real)
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Función para throttle (útil para scroll events)
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Exportar funciones para uso global
window.DistriCampoUtils = {
  showNotification,
  isValidEmail,
  isValidPhone,
  sanitizeInput,
  formatDate,
  formatCurrency,
  makeRequest,
  isAuthenticated,
  requireAuth,
  logout,
  getCurrentUser,
  showSpinner,
  validateForm,
  clearForm,
  confirmAction,
  generateId,
  debounce,
  throttle
};

// Log de inicialización
console.log('🔧 DistriCampo Utils cargado correctamente');
