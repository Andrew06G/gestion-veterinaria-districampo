# 🏥 Sistema de Gestión Veterinaria - Veterilab

Sistema completo de gestión de análisis clínicos veterinarios con arquitectura MVC y API REST.

## 🏗️ **ARQUITECTURA DEL PROYECTO**

### **📁 Estructura de Carpetas (MVC + REST)**

```
backend/
├── 📁 src/                    # Código fuente principal
│   ├── 📁 models/            # Modelos de datos (MVC)
│   │   ├── User.js          # Modelo de usuario
│   │   ├── Animal.js        # Modelo de animal
│   │   └── Analysis.js      # Modelo de análisis
│   ├── 📁 controllers/      # Controladores (MVC)
│   │   └── userController.js # Lógica de usuarios
│   ├── 📁 routes/           # Rutas de la API (REST)
│   │   ├── userRoutes.js    # Endpoints de usuarios
│   │   ├── animalRoutes.js  # Endpoints de animales
│   │   ├── analysisRoutes.js # Endpoints de análisis
│   │   └── pdfRoutes.js     # Endpoints de PDF
│   ├── 📁 middleware/       # Middleware personalizado
│   │   └── auth.js          # Autenticación JWT
│   ├── 📁 config/           # Configuración
│   │   └── db.js            # Conexión a base de datos
│   └── 📁 utils/            # Utilidades
├── 📁 public/                # Frontend (Vista)
│   ├── 📁 pages/            # Páginas HTML
│   └── 📁 assets/           # Recursos estáticos
│       ├── 📁 css/          # Estilos CSS
│       └── 📁 js/           # JavaScript frontend
├── server.js                 # Servidor principal
├── package.json              # Dependencias
└── .env                      # Variables de entorno
```

### **🎯 Patrón de Diseño Implementado**

- **MVC (Modelo-Vista-Controlador)**: Separación clara de responsabilidades
- **REST API**: Endpoints RESTful para comunicación frontend-backend
- **Middleware**: Autenticación JWT y validaciones
- **Hasheo**: Contraseñas encriptadas con bcrypt
- **Modelos**: Lógica de acceso a datos encapsulada

---

## 🚀 **INSTALACIÓN RÁPIDA**

### **1. Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd gestion-veterinaria-districampo/backend
```

### **2. Instalar dependencias**
```bash
npm install
```

### **3. Configurar base de datos**
```bash
# Crear archivo .env basado en .env.example
cp .env.example .env

# Editar .env con tus credenciales de base de datos
```

### **4. Crear base de datos**
```sql
CREATE DATABASE veterilab2;
USE veterilab2;

-- Ejecutar el script SQL de la base de datos
-- (consultar documentación de la base de datos)
```

### **5. Iniciar servidor**
```bash
npm start
# o
node server.js
```

---

## 🔧 **CONFIGURACIÓN**

### **Variables de Entorno (.env)**
```env
# Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=veterilab2
DB_PORT=3306

# Servidor
PORT=3001
JWT_SECRET=!V3t3R1L4b @!
ENCRYPTION_KEY=your_32_byte_hex_encryption_key_here

# CORS
CORS_ORIGIN=http://localhost:3000
```

---

## 📋 **FUNCIONALIDADES PRINCIPALES**

### **👤 Gestión de Usuarios**
- ✅ Registro de propietarios con validación de contraseñas
- ✅ Inicio de sesión con JWT seguro
- ✅ Autenticación con tokens de 24h
- ✅ Cifrado de datos sensibles (email, teléfono, dirección)

### **🐕 Gestión de Animales**
- ✅ Registro de animales con cifrado de nombres
- ✅ Dropdowns dependientes (especie → raza)
- ✅ Lista de animales por propietario

### **🔬 Análisis Clínicos**
- ✅ Solicitud de análisis
- ✅ Seguimiento de estado
- ✅ Generación de PDF
- ✅ Filtros avanzados

---

## 🌐 **API ENDPOINTS**

### **👤 Usuarios**
- `POST /api/users/register` - Registrar usuario
- `POST /api/users/login` - Iniciar sesión

### **🐕 Animales**
- `POST /api/animals/register` - Registrar animal
- `GET /api/animals` - Listar animales del usuario
- `GET /api/animals/user/list` - Lista simple para dropdowns
- `GET /api/animals/especies/list` - Listar especies
- `GET /api/animals/razas/especie/:id` - Razas por especie

### **🔬 Análisis**
- `POST /api/analyses` - Solicitar análisis
- `GET /api/analyses` - Listar análisis del usuario
- `GET /api/analyses/tipos` - Tipos de análisis disponibles
- `GET /api/analyses/:id/pdf` - Datos para PDF

---

## 🛠️ **TECNOLOGÍAS UTILIZADAS**

### **Backend**
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MySQL2** - Cliente de base de datos
- **JWT** - Autenticación
- **bcrypt** - Encriptación de contraseñas
- **CORS** - Cross-Origin Resource Sharing

### **Frontend**
- **HTML5** - Estructura de páginas
- **CSS3** - Estilos y diseño
- **JavaScript ES6+** - Lógica del cliente
- **Bootstrap 4** - Framework CSS

### **Base de Datos**
- **MySQL** - Sistema de gestión de base de datos

---

## 🔒 **SEGURIDAD**

- **JWT Tokens** para autenticación
- **Contraseñas encriptadas** con bcrypt
- **Validación de entrada** en todos los endpoints
- **Middleware de autenticación** para rutas protegidas
- **CORS configurado** para seguridad

---

## 📱 **INTERFAZ DE USUARIO**

- **Responsive Design** - Adaptable a todos los dispositivos
- **Navegación intuitiva** - Menú claro y organizado
- **Formularios validados** - Validación en tiempo real
- **Dropdowns dependientes** - Selección lógica de especies y razas
- **Tablas interactivas** - Filtros y ordenamiento

---

## 🚀 **COMANDOS ÚTILES**

```bash
# Desarrollo
npm start          # Iniciar servidor
npm run dev        # Modo desarrollo (si está configurado)

# Base de datos
npm run db:test    # Probar conexión a BD (si está configurado)

# Limpieza
npm run clean      # Limpiar archivos temporales (si está configurado)
```

---

## 🔒 **SEGURIDAD**

### **Contraseñas**
- Hash bcrypt con 12 salt rounds
- Validación de fortaleza en frontend y backend
- Criterios: longitud mínima, complejidad, caracteres especiales

### **Datos Sensibles**
- Cifrado AES-256-CBC para datos sensibles
- Campos cifrados: emails, teléfonos, direcciones, nombres de animales
- IV aleatorio para cada cifrado
- Descifrado automático en consultas

### **Autenticación**
- JWT con clave segura configurada
- Tokens con expiración de 24 horas
- Middleware de autenticación en todas las rutas protegidas

### **Variables de Entorno**
- `JWT_SECRET`: Clave para firmar tokens JWT
- `ENCRYPTION_KEY`: Clave de 32 bytes para cifrado AES-256
- Nunca commitear archivos `.env` al repositorio

---

## 🐛 **SOLUCIÓN DE PROBLEMAS**

### **Error de conexión a base de datos**
- Verificar credenciales en `.env`
- Asegurar que MySQL esté ejecutándose
- Verificar que la base de datos exista

### **Error de autenticación JWT**
- Verificar que `JWT_SECRET` esté configurado
- Limpiar localStorage del navegador
- Verificar que el token no haya expirado

### **Error de CORS**
- Verificar configuración de `CORS_ORIGIN`
- Asegurar que el frontend esté en el puerto correcto

---

## 🤝 **CONTRIBUCIÓN**

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 **LICENCIA**

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 📞 **SOPORTE**

Si tienes preguntas o problemas:
- Crear un issue en GitHub
- Contactar al equipo de desarrollo
- Consultar la documentación de la API

---

## 🎯 **ROADMAP FUTURO**

- [ ] Panel de administración
- [ ] Notificaciones por email
- [ ] API para aplicaciones móviles
- [ ] Sistema de reportes avanzados
- [ ] Integración con laboratorios externos
- [ ] Historial médico completo de animales

---

**✨ ¡Gracias por usar la aplicación! ✨** 