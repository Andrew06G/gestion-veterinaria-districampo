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
      if (document.querySelector("nav.navbar")) {
        callback();
      } else {
        const observer = new MutationObserver(() => {
          if (document.querySelector("nav.navbar")) {
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
  
      const nav = document.querySelector("nav.navbar");
      const floating = document.createElement("div");
      floating.id = "notificationFloating";
      floating.className = "notification-floating";
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
  
    // Agregar estilos CSS dinámicamente
    addStyles() {
      if (document.getElementById("notification-styles")) return;
  
      const style = document.createElement("style");
      style.id = "notification-styles";
      style.textContent = `
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
        panel.classList.toggle("active");
        this.isOpen = panel.classList.contains("active");
      }
    }
  
    closePanel() {
      const panel = document.getElementById("notificationPanel");
      if (panel) panel.classList.remove("active");
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
        list.innerHTML = `
          <div class="no-notifications">
            <i class="fas fa-bell-slash"></i>
            <p>No hay notificaciones</p>
          </div>`;
        return;
      }
  
      list.innerHTML = this.notifications
        .map(
          (n) => `
        <div class="notification-item ${!n.leida ? "unread" : ""}" onclick="notificationSystem.markAsRead(${n.id})">
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
  
    getIconForType(type) {
      return {
        info: "fa-info-circle",
        success: "fa-check-circle",
        warning: "fa-exclamation-triangle",
        error: "fa-times-circle",
      }[type] || "fa-bell";
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
  