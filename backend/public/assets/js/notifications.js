// Sistema de notificaciones persistente para propietarios
class NotificationSystem {
    constructor() {
      this.notifications = [];
      this.isOpen = false;
      this.userId = null;
      this.init();
    }
  
    // Inicialización general
    init() {
      this.getUserId();
      this.waitForNavbar(() => {
        this.createNotificationContainer();
        this.loadNotifications();
      });

    // Sincronizar entre pestañas/ventanas
    window.addEventListener('storage', (event) => {
      if (event.key === 'notifications_last_read') {
        this.loadNotifications();
      }
    });
    }
  
    // Espera hasta que el navbar esté disponible en el DOM
    waitForNavbar(callback) {
      // Detectar si estamos en el frontend recomendado
      this.isRecommendedFrontend = window.location.pathname.includes('/recomended');
      
      const navSelector = this.isRecommendedFrontend ? "nav" : "nav.navbar";
      
      if (document.querySelector(navSelector)) {
        callback();
      } else {
        const observer = new MutationObserver(() => {
          if (document.querySelector(navSelector)) {
            observer.disconnect();
            callback();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }
    }
  
    // Obtener ID del usuario desde el JWT
    getUserId() {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const payload = JSON.parse(atob(token.split(".")[1]));
          this.userId = payload.id;
        // ID del usuario obtenido del token JWT
        }
      } catch (error) {
        console.error("Error al obtener ID del usuario:", error);
      }
    }
  
    // Crear el contenedor flotante y panel
    createNotificationContainer() {
      if (document.getElementById("notificationFloating")) return;
      
      // Si estamos en el frontend recomendado y ya existe un contenedor, usar ese
      if (this.isRecommendedFrontend && document.getElementById("notificationContainer")) {
        this.setupRecommendedContainer();
        return;
      }
  
      const navSelector = this.isRecommendedFrontend ? "nav" : "nav.navbar";
      const nav = document.querySelector(navSelector);
      const floating = document.createElement("div");
      floating.id = "notificationFloating";
      floating.className = "notification-floating";
      
      // HTML diferente según el frontend
      if (this.isRecommendedFrontend) {
        floating.innerHTML = `
          <button class="notification-icon-recommended" id="notificationBtn" aria-label="Notificaciones">
            <span class="material-symbols-outlined">notifications</span>
            <span class="notification-badge-recommended" id="notificationBadge" style="display:none;">0</span>
          </button>
          <div class="notifications-panel-recommended" id="notificationPanel">
            <div class="notification-header-recommended">
              <h3 class="font-semibold text-lg text-white">Notificaciones</h3>
              <button class="close-btn-recommended" id="closeNotifications">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <div class="notification-content-recommended">
              <div id="notificationList" class="notification-list-recommended">
                <div class="no-notifications-recommended">
                  <span class="material-symbols-outlined text-4xl text-gray-400 mb-2">notifications_off</span>
                  <p class="text-gray-500">No hay notificaciones</p>
                </div>
              </div>
            </div>
            <div class="notification-footer-recommended">
              <button class="btn-mark-all-read-recommended" id="markAllRead">Marcar todas como leídas</button>
            </div>
          </div>
        `;
      } else {
        floating.innerHTML = `
          <a class="notification-icon" href="#" id="notificationBtn" aria-label="Notificaciones">
            <i class="fa-solid fa-bell"></i>
            <span class="notification-badge" id="notificationBadge" style="display:none;">0</span>
          </a>
          <div class="notifications-panel" id="notificationPanel">
            <div class="notification-header">
              <h6>Notificaciones</h6>
              <button class="close-btn" id="closeNotifications">&times;</button>
            </div>
            <div class="notification-content">
              <div id="notificationList" class="notification-list">
                <div class="no-notifications">
                  <i class="fas fa-bell-slash"></i>
                  <p>No hay notificaciones</p>
                </div>
              </div>
            </div>
            <div class="notification-footer">
              <button class="btn btn-sm btn-outline-primary" id="markAllRead">Marcar todas como leídas</button>
            </div>
          </div>
        `;
      }
      
      document.body.appendChild(floating);
  
      // Ajustar posición dinámica según el navbar
      const updatePosition = () => {
        const navHeight = nav ? nav.getBoundingClientRect().height : 56;
        floating.style.top = `${navHeight + 8}px`;
        floating.style.right = "16px";
      };
  
      setTimeout(updatePosition, 200);
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, { passive: true });
  
      this.addStyles();
      this.addEventListeners();
    }

    // Configurar el contenedor existente en el frontend recomendado
    setupRecommendedContainer() {
      const container = document.getElementById("notificationContainer");
      if (!container) return;

      // El contenedor ya tiene los IDs correctos, solo necesitamos configurar los estilos y eventos
      this.addStyles();
      this.addEventListeners();
    }
  
    // Agregar estilos CSS dinámicamente
    addStyles() {
      if (document.getElementById("notification-styles")) return;
  
      const style = document.createElement("style");
      style.id = "notification-styles";
      
      // Estilos base para el frontend oficial
      const officialStyles = `
        .notification-floating {
          position: fixed;
          right: 16px;
          top: 64px;
          z-index: 2000;
        }
        .notification-icon {
          color: #f8f9fa !important;
          font-size: 22px;
          cursor: pointer;
          position: relative;
          text-decoration: none !important;
          transition: transform 0.3s ease, color 0.3s ease;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        .notification-icon:hover { transform: scale(1.1); color: #ffffff !important; }
        .notification-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background-color: #dc3545;
          color: white;
          border-radius: 50%;
          width: 18px; height: 18px;
          font-size: 10px; font-weight: bold;
          display: flex; align-items: center; justify-content: center;
        }
        .notifications-panel {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 512px;
          max-height: 455px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(10px);
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          border: 1px solid rgba(0,0,0,0.1);
          display: none;
          z-index: 2001;
        }
        .notifications-panel.active { display: block; }
        .notification-header {
          padding: 12px 16px;
          background: linear-gradient(135deg, #6c5ce7, #a29bfe);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 10px 10px 0 0;
        }
        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .close-btn:hover { background-color: rgba(255,255,255,0.2); }
        .notification-content { max-height: 370px; overflow-y: auto; }
        .no-notifications {
          text-align: center; padding: 30px 20px; color: #6c757d;
        }
        .no-notifications i { font-size: 32px; margin-bottom: 10px; opacity: 0.5; }
        .notification-item {
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
          background: white;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }
        .notification-item:hover { background-color: #f8f9fa; transform: translateX(2px); }
        .notification-item.unread { background-color: #eef3ff; border-left: 4px solid #6c5ce7; }
        .notification-content-item { display: flex; align-items: flex-start; gap: 12px; }
        .notification-type-icon {
          width: 32px; height: 32px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: white; flex-shrink: 0;
        }
        .notification-type-icon.info { background-color: #6c5ce7; }
        .notification-type-icon.success { background-color: #00b894; }
        .notification-type-icon.warning { background-color: #fdcb6e; }
        .notification-type-icon.error { background-color: #e17055; }
        .notification-text { flex: 1; }
        .notification-title { font-weight: 600; font-size: 14px; margin-bottom: 4px; color: #2d3436; }
        .notification-message { 
          font-size: 13px; 
          color: #636e72; 
          margin-bottom: 4px;
          word-wrap: break-word;
          white-space: normal;
        }
        .notification-time { font-size: 11px; color: #b2bec3; }
        .notification-footer { 
          position: sticky;
          bottom: 0;
          background-color: #f8f9fa;
          border-top: 1px solid #e9ecef;
          padding: 12px;
          text-align: center;
          z-index: 1;
        }
        @media (max-width: 768px) {
          .notifications-panel { width: 280px; }
          .notification-icon { font-size: 18px; }
        }
      `;
      
      // Estilos para el frontend recomendado
      const recommendedStyles = `
        .notification-icon-recommended {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #0D1B2A;
          font-size: 24px;
          cursor: pointer;
          position: relative;
          text-decoration: none;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: none;
        }
        .notification-icon-recommended:hover { 
          transform: scale(1.05); 
          background: rgba(255, 255, 255, 0.2);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
        .notification-badge-recommended {
          position: absolute;
          top: -6px;
          right: -6px;
          background: linear-gradient(135deg, #ff6b6b, #ee5a52);
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 11px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
        }
        .notifications-panel-recommended {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 400px;
          max-height: 500px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: none;
          z-index: 2001;
        }
        .notifications-panel-recommended.active { 
          display: block;
          animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .notification-header-recommended {
          padding: 16px 20px;
          background: linear-gradient(135deg, #0A74DA, #4A90E2);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 16px 16px 0 0;
        }
        .close-btn-recommended {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.2s;
          padding: 4px;
          border-radius: 6px;
        }
        .close-btn-recommended:hover { 
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }
        .notification-content-recommended { 
          max-height: 400px; 
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e0 #f7fafc;
        }
        .notification-content-recommended::-webkit-scrollbar {
          width: 6px;
        }
        .notification-content-recommended::-webkit-scrollbar-track {
          background: #f7fafc;
        }
        .notification-content-recommended::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 3px;
        }
        .no-notifications-recommended {
          text-align: center;
          padding: 40px 20px;
          color: #6b7280;
        }
        .notification-item-recommended {
          padding: 16px 20px;
          border-bottom: 1px solid #f0f0f0;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }
        .notification-item-recommended:hover { 
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          transform: translateX(4px);
        }
        .notification-item-recommended.unread { 
          background: linear-gradient(135deg, #eef3ff, #e0e7ff);
          border-left: 4px solid #0A74DA;
        }
        .notification-content-item-recommended { 
          display: flex; 
          align-items: flex-start; 
          gap: 12px; 
        }
        .notification-type-icon-recommended {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
          font-size: 18px;
        }
        .notification-type-icon-recommended.info { 
          background: linear-gradient(135deg, #0A74DA, #4A90E2);
        }
        .notification-type-icon-recommended.success { 
          background: linear-gradient(135deg, #10b981, #34d399);
        }
        .notification-type-icon-recommended.warning { 
          background: linear-gradient(135deg, #f59e0b, #fbbf24);
        }
        .notification-type-icon-recommended.error { 
          background: linear-gradient(135deg, #ef4444, #f87171);
        }
        .notification-text-recommended { 
          flex: 1; 
        }
        .notification-title-recommended { 
          font-weight: 600; 
          font-size: 14px; 
          margin-bottom: 4px; 
          color: #1f2937;
        }
        .notification-message-recommended { 
          font-size: 13px; 
          color: #6b7280; 
          margin-bottom: 6px;
          word-wrap: break-word;
          white-space: normal;
          line-height: 1.4;
        }
        .notification-time-recommended { 
          font-size: 11px; 
          color: #9ca3af;
          font-weight: 500;
        }
        .notification-footer-recommended { 
          position: sticky;
          bottom: 0;
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          border-top: 1px solid #e5e7eb;
          padding: 16px 20px;
          text-align: center;
          z-index: 1;
        }
        .btn-mark-all-read-recommended {
          background: linear-gradient(135deg, #0A74DA, #4A90E2);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-mark-all-read-recommended:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(10, 116, 218, 0.3);
        }
        @media (max-width: 768px) {
          .notifications-panel-recommended { 
            width: 320px; 
          }
          .notification-icon-recommended { 
            width: 44px;
            height: 44px;
            font-size: 20px;
          }
        }
      `;
      
      // Aplicar estilos según el frontend
      const allStyles = this.isRecommendedFrontend ? recommendedStyles : officialStyles;
      style.textContent = allStyles;
      document.head.appendChild(style);
    }
  
    // Listeners de los botones
    addEventListeners() {
      const btn = document.getElementById("notificationBtn");
      const closeBtn = document.getElementById("closeNotifications");
      const markAll = document.getElementById("markAllRead");
  
      if (btn) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.togglePanel();
        });
      }
      if (closeBtn) closeBtn.addEventListener("click", () => this.closePanel());
      if (markAll) markAll.addEventListener("click", () => this.markAllAsRead());
  
      document.addEventListener("click", (e) => {
        const panel = document.getElementById("notificationPanel");
        const icon = document.getElementById("notificationBtn");
        if (panel && !panel.contains(e.target) && !icon.contains(e.target)) {
          this.closePanel();
        }
      });
    }
  
    togglePanel() {
      const panel = document.getElementById("notificationPanel");
      if (panel) {
        if (this.isRecommendedFrontend) {
          // Para el frontend recomendado, usar clases de Tailwind
          panel.classList.toggle("hidden");
          this.isOpen = !panel.classList.contains("hidden");
        } else {
          // Para el frontend oficial, usar clases CSS
          panel.classList.toggle("active");
          this.isOpen = panel.classList.contains("active");
        }
      }
    }
  
    closePanel() {
      const panel = document.getElementById("notificationPanel");
      if (panel) {
        if (this.isRecommendedFrontend) {
          // Para el frontend recomendado, usar clases de Tailwind
          panel.classList.add("hidden");
          this.isOpen = false;
        } else {
          // Para el frontend oficial, usar clases CSS
          panel.classList.remove("active");
        }
      }
    }
  
    async loadNotifications() {
      if (!this.userId) return console.warn("No se pudo obtener el ID del usuario");
  
      try {
        const res = await fetch(`/api/notifications/${this.userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error(res.statusText);
  
        const data = await res.json();
        this.notifications = data.notifications || [];
        this.updateBadge();
        this.renderNotifications();
      } catch (err) {
        console.error("Error al cargar notificaciones:", err);
      }
    }
  
    async addNotification({ title, message, type = "info" }) {
      if (!this.userId) return;
      try {
        const res = await fetch("/api/notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ user_id: this.userId, titulo: title, mensaje: message, tipo: type }),
        });
        if (res.ok) await this.loadNotifications();
      } catch (err) {
        console.error("Error al crear notificación:", err);
      }
    }
  
    async markAllAsRead() {
      try {
        const res = await fetch("/api/notifications/mark-all-read", {
          method: "PUT",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.ok) {
          this.notifications.forEach((n) => (n.leida = true));
          this.updateBadge();
          this.renderNotifications();

        // Guardar sincronización global entre pestañas
        localStorage.setItem('notifications_last_read', String(Date.now()));
        }
      } catch (err) {
        console.error("Error al marcar todas como leídas:", err);
      }
    }
  
    async markAsRead(id) {
      try {
        const res = await fetch(`/api/notifications/${id}/read`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.ok) {
          const n = this.notifications.find((x) => x.id === id);
          if (n) n.leida = true;
          this.updateBadge();
          this.renderNotifications();
        }
      } catch (err) {
        console.error("Error al marcar como leída:", err);
      }
    }

    async openRelatedAnalysis(notificationId, id_resultado) {
      // Marcar como leída
      await this.markAsRead(notificationId);

      if (id_resultado && id_resultado !== 'null') {
        // Guardamos el ID del análisis que queremos resaltar
        localStorage.setItem('highlight_analysis_id', id_resultado);
      }

      // Cerrar el panel de notificaciones
      this.closePanel();

      // Redirigir a la vista "Mis análisis" según el frontend
      if (this.isRecommendedFrontend) {
        window.location.href = "/recomended/mis-analisis";
      } else {
        window.location.href = "/mis-analisis";
      }
    }
  
    updateBadge() {
      const badge = document.getElementById("notificationBadge");
      if (!badge) return;
      const count = this.notifications.filter((n) => !n.leida).length;
      badge.textContent = count > 0 ? count : "";
      badge.style.display = count > 0 ? "flex" : "none";
    }
  
    renderNotifications() {
      const list = document.getElementById("notificationList");
      if (!list) return;
  
      if (this.notifications.length === 0) {
        if (this.isRecommendedFrontend) {
          list.innerHTML = `
            <div class="no-notifications-recommended">
              <span class="material-symbols-outlined text-4xl text-gray-400 mb-2">notifications_off</span>
              <p class="text-gray-500">No hay notificaciones</p>
            </div>`;
        } else {
          list.innerHTML = `
            <div class="no-notifications">
              <i class="fas fa-bell-slash"></i>
              <p>No hay notificaciones</p>
            </div>`;
        }
        return;
      }
  
      if (this.isRecommendedFrontend) {
        list.innerHTML = this.notifications
          .map(
            (n) => `
          <div class="notification-item-recommended ${!n.leida ? "unread" : ""}" 
            onclick="notificationSystem.openRelatedAnalysis(${n.id}, ${n.id_resultado || 'null'})">
            <div class="notification-content-item-recommended">
              <div class="notification-type-icon-recommended ${n.tipo}">
                <span class="material-symbols-outlined">${this.getIconForType(n.tipo)}</span>
              </div>
              <div class="notification-text-recommended">
                <div class="notification-title-recommended">${n.titulo}</div>
                <div class="notification-message-recommended">${n.mensaje}</div>
                <div class="notification-time-recommended">${this.formatTime(n.fecha_creacion)}</div>
              </div>
            </div>
          </div>`
          )
          .join("");
      } else {
        list.innerHTML = this.notifications
          .map(
            (n) => `
          <div class="notification-item ${!n.leida ? "unread" : ""}" 
            onclick="notificationSystem.openRelatedAnalysis(${n.id}, ${n.id_resultado || 'null'})">
            <div class="notification-content-item">
              <div class="notification-type-icon ${n.tipo}">
                <i class="fas ${this.getIconForType(n.tipo)}"></i>
              </div>
              <div class="notification-text">
                <div class="notification-title">${n.titulo}</div>
                <div class="notification-message">${n.mensaje}</div>
                <div class="notification-time">${this.formatTime(n.fecha_creacion)}</div>
              </div>
            </div>
          </div>`
          )
          .join("");
      }
    }
  
    getIconForType(type) {
      if (this.isRecommendedFrontend) {
        return {
          info: "info",
          success: "check_circle",
          warning: "warning",
          error: "error",
        }[type] || "notifications";
      } else {
        return {
          info: "fa-info-circle",
          success: "fa-check-circle",
          warning: "fa-exclamation-triangle",
          error: "fa-times-circle",
        }[type] || "fa-bell";
      }
    }
  
    formatTime(ts) {
      const now = new Date();
      const date = new Date(ts);
      const diff = now - date;
      if (diff < 60000) return "Ahora";
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
      return `${Math.floor(diff / 86400000)}d`;
    }
  
    // Método de prueba
    addTestNotification() {
      this.addNotification({
        type: "info",
        title: "Análisis en proceso",
        message: "Tu análisis de sangre ha comenzado a procesarse.",
      });
    }
  }
  
  // Inicializar
  const notificationSystem = new NotificationSystem();
  window.notificationSystem = notificationSystem;
  