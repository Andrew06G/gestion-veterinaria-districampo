// Sistema de gestión de sesión para DistriCampo
class SessionManager {
  constructor() {
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    return this.token !== null && this.user !== null;
  }

  // Obtener el token de autenticación
  getToken() {
    return this.token;
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
      alert('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
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
        alert('Sesión expirada. Por favor, inicie sesión nuevamente.');
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
      alert('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
      this.logout();
      return false;
    }

    return true;
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