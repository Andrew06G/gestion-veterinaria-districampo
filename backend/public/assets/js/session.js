// Sistema de gestión de sesión para DistriCampo
class SessionManager {
  constructor() {
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    this._idleTimer = null;
    this._idleTimeoutMs = 10 * 60 * 1000; // 10 minutos
    this._bindIdleDetection();
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    return this.token !== null && this.user !== null;
  }

  // Obtener el token de autenticación
  getToken() {
    return this.token;
  }

  // Obtener el token de administrador
  getAdminToken() {
    return localStorage.getItem('adminToken');
  }

  // Obtener información del usuario
  getUser() {
    return this.user;
  }

  // Guardar sesión después del login
  setSession(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this._resetIdleTimer();
  }

  // Cerrar sesión
  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  // Verificar si la sesión ha expirado
  isTokenExpired() {
    if (!this.token) return true;
    
    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  // Función para hacer peticiones autenticadas
  async authenticatedFetch(url, options = {}) {
    if (!this.isAuthenticated()) {
      this.logout();
      return null;
    }

    if (this.isTokenExpired()) {
      alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      this.logout();
      return null;
    }

    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
    };

    const finalOptions = { ...defaultOptions, ...options };
    // Permitir usar rutas relativas sin puerto hardcodeado
    let requestUrl = url;
    if (typeof url === 'string' && !/^https?:\/\//i.test(url)) {
      requestUrl = `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
    }
    
    try {
      const response = await fetch(requestUrl, finalOptions);
      
      if (response.status === 401) {
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        this.logout();
        return null;
      }
      
      return response;
    } catch (error) {
      console.error('Error en petición autenticada:', error);
      throw error;
    }
  }

  // Función para verificar autenticación en páginas protegidas
  requireAuth() {
    if (!this.isAuthenticated()) {
      alert('Debe iniciar sesión para acceder a esta página.');
      window.location.href = '/login';
      return false;
    }

    if (this.isTokenExpired()) {
      alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      this.logout();
      return false;
    }

    return true;
  }

  // Detección de inactividad (solo aplica para propietarios en frontend público)
  _bindIdleDetection() {
    const reset = () => this._resetIdleTimer();
    ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(evt => {
      window.addEventListener(evt, reset, { passive: true });
    });
    this._resetIdleTimer();
  }

  _resetIdleTimer() {
    if (this._idleTimer) clearTimeout(this._idleTimer);
    if (this.isAuthenticated()) {
      this._idleTimer = setTimeout(() => {
        alert('Tu sesión se ha cerrado por inactividad.');
        this.logout();
      }, this._idleTimeoutMs);
    }
  }
}

// Crear instancia global del gestor de sesión
const sessionManager = new SessionManager();

// Función global para cerrar sesión
function logout() {
  sessionManager.logout();
}

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SessionManager;
} 