// Sistema de notificaciones adaptado para el frontend recomendado
class NotificationSystemAdapted {
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
        if (document.querySelector("nav")) {
            callback();
        } else {
            const observer = new MutationObserver(() => {
                if (document.querySelector("nav")) {
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
            }
        } catch (error) {
            console.error("Error al obtener ID del usuario:", error);
        }
    }

    // Crear el contenedor flotante y panel
    createNotificationContainer() {
        if (document.getElementById("notificationFloating")) return;

        const nav = document.querySelector("nav");
        const floating = document.createElement("div");
        floating.id = "notificationFloating";
        floating.className = "notification-floating-adapted";
        floating.innerHTML = `
            <button class="notification-icon-adapted" id="notificationBtn" aria-label="Notificaciones">
                <span class="material-symbols-outlined">notifications</span>
                <span class="notification-badge-adapted" id="notificationBadge" style="display:none;">0</span>
            </button>
            <div class="notifications-panel-adapted" id="notificationPanel">
                <div class="notification-header-adapted">
                    <h3 class="font-semibold text-lg text-white">Notificaciones</h3>
                    <button class="close-btn-adapted" id="closeNotifications">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div class="notification-content-adapted">
                    <div id="notificationList" class="notification-list-adapted">
                        <div class="no-notifications-adapted">
                            <span class="material-symbols-outlined text-4xl text-gray-400 mb-2">notifications_off</span>
                            <p class="text-gray-500">No hay notificaciones</p>
                        </div>
                    </div>
                </div>
                <div class="notification-footer-adapted">
                    <button class="btn-mark-all-read-adapted" id="markAllRead">Marcar todas como leídas</button>
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
        if (document.getElementById("notification-styles-adapted")) return;

        const style = document.createElement("style");
        style.id = "notification-styles-adapted";
        style.textContent = `
            .notification-floating-adapted {
                position: fixed;
                right: 16px;
                top: 64px;
                z-index: 2000;
            }
            .notification-icon-adapted {
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
            .notification-icon-adapted:hover { 
                transform: scale(1.05); 
                background: rgba(255, 255, 255, 0.2);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
            }
            .notification-badge-adapted {
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
            .notifications-panel-adapted {
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
            .notifications-panel-adapted.active { 
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
            .notification-header-adapted {
                padding: 16px 20px;
                background: linear-gradient(135deg, #0A74DA, #4A90E2);
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 16px 16px 0 0;
            }
            .close-btn-adapted {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                transition: all 0.2s;
                padding: 4px;
                border-radius: 6px;
            }
            .close-btn-adapted:hover { 
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.1);
            }
            .notification-content-adapted { 
                max-height: 400px; 
                overflow-y: auto;
                scrollbar-width: thin;
                scrollbar-color: #cbd5e0 #f7fafc;
            }
            .notification-content-adapted::-webkit-scrollbar {
                width: 6px;
            }
            .notification-content-adapted::-webkit-scrollbar-track {
                background: #f7fafc;
            }
            .notification-content-adapted::-webkit-scrollbar-thumb {
                background: #cbd5e0;
                border-radius: 3px;
            }
            .no-notifications-adapted {
                text-align: center;
                padding: 40px 20px;
                color: #6b7280;
            }
            .notification-item-adapted {
                padding: 16px 20px;
                border-bottom: 1px solid #f0f0f0;
                background: white;
                cursor: pointer;
                transition: all 0.2s;
            }
            .notification-item-adapted:hover { 
                background: linear-gradient(135deg, #f8fafc, #e2e8f0);
                transform: translateX(4px);
            }
            .notification-item-adapted.unread { 
                background: linear-gradient(135deg, #eef3ff, #e0e7ff);
                border-left: 4px solid #0A74DA;
            }
            .notification-content-item-adapted { 
                display: flex; 
                align-items: flex-start; 
                gap: 12px; 
            }
            .notification-type-icon-adapted {
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
            .notification-type-icon-adapted.info { 
                background: linear-gradient(135deg, #0A74DA, #4A90E2);
            }
            .notification-type-icon-adapted.success { 
                background: linear-gradient(135deg, #10b981, #34d399);
            }
            .notification-type-icon-adapted.warning { 
                background: linear-gradient(135deg, #f59e0b, #fbbf24);
            }
            .notification-type-icon-adapted.error { 
                background: linear-gradient(135deg, #ef4444, #f87171);
            }
            .notification-text-adapted { 
                flex: 1; 
            }
            .notification-title-adapted { 
                font-weight: 600; 
                font-size: 14px; 
                margin-bottom: 4px; 
                color: #1f2937;
            }
            .notification-message-adapted { 
                font-size: 13px; 
                color: #6b7280; 
                margin-bottom: 6px;
                word-wrap: break-word;
                white-space: normal;
                line-height: 1.4;
            }
            .notification-time-adapted { 
                font-size: 11px; 
                color: #9ca3af;
                font-weight: 500;
            }
            .notification-footer-adapted { 
                position: sticky;
                bottom: 0;
                background: linear-gradient(135deg, #f8fafc, #e2e8f0);
                border-top: 1px solid #e5e7eb;
                padding: 16px 20px;
                text-align: center;
                z-index: 1;
            }
            .btn-mark-all-read-adapted {
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
            .btn-mark-all-read-adapted:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(10, 116, 218, 0.3);
            }
            @media (max-width: 768px) {
                .notifications-panel-adapted { 
                    width: 320px; 
                }
                .notification-icon-adapted { 
                    width: 44px;
                    height: 44px;
                    font-size: 20px;
                }
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

    async openRelatedAnalysis(notificationId, id_resultado) {
        // Marcar como leída
        await this.markAsRead(notificationId);

        if (id_resultado && id_resultado !== 'null') {
            // Guardamos el ID del análisis que queremos resaltar
            localStorage.setItem('highlight_analysis_id', id_resultado);
        }

        // Cerrar el panel de notificaciones
        this.closePanel();

        // Redirigir a la vista "Mis análisis" recomendada
        window.location.href = "/recomended/mis-analisis";
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
                <div class="no-notifications-adapted">
                    <span class="material-symbols-outlined text-4xl text-gray-400 mb-2">notifications_off</span>
                    <p class="text-gray-500">No hay notificaciones</p>
                </div>`;
            return;
        }

        list.innerHTML = this.notifications
            .map(
                (n) => `
            <div class="notification-item-adapted ${!n.leida ? "unread" : ""}" 
                onclick="notificationSystemAdapted.openRelatedAnalysis(${n.id}, ${n.id_resultado || 'null'})">
                <div class="notification-content-item-adapted">
                    <div class="notification-type-icon-adapted ${n.tipo}">
                        <span class="material-symbols-outlined">${this.getIconForType(n.tipo)}</span>
                    </div>
                    <div class="notification-text-adapted">
                        <div class="notification-title-adapted">${n.titulo}</div>
                        <div class="notification-message-adapted">${n.mensaje}</div>
                        <div class="notification-time-adapted">${this.formatTime(n.fecha_creacion)}</div>
                    </div>
                </div>
            </div>`
            )
            .join("");
    }

    getIconForType(type) {
        return {
            info: "info",
            success: "check_circle",
            warning: "warning",
            error: "error",
        }[type] || "notifications";
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
const notificationSystemAdapted = new NotificationSystemAdapted();
window.notificationSystemAdapted = notificationSystemAdapted;
