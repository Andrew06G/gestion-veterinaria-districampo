# 🏥 Sistema de Gestión Veterinaria - Backend

Sistema backend para la gestión de análisis clínicos veterinarios, desarrollado con Node.js, Express y MySQL.

## 🚀 Instalación Rápida

### Prerrequisitos
- **Node.js** (versión 16 o superior)
- **MySQL** (versión 8.0 o superior)
- **Git**

### 1. Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd gestion-veterinaria-districampo/backend
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Base de Datos

#### Opción A: Usar archivo .env (Recomendado)
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales
nano .env  # o usar tu editor preferido
```

**Contenido del archivo .env:**
```env
DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_password_mysql
DB_NAME=nombre_de_tu_base_de_datos
DB_PORT=3306
PORT=3001
JWT_SECRET=tu_clave_secreta_super_segura_aqui
```

#### Opción B: Variables de entorno del sistema
```bash
export DB_HOST=localhost
export DB_USER=tu_usuario_mysql
export DB_PASSWORD=tu_password_mysql
export DB_NAME=nombre_de_tu_base_de_datos
export DB_PORT=3306
export PORT=3001
export JWT_SECRET=tu_clave_secreta_super_segura_aqui
```

### 4. Crear Base de Datos
```sql
CREATE DATABASE nombre_de_tu_base_de_datos;
USE nombre_de_tu_base_de_datos;
```

### 5. Ejecutar Scripts de Base de Datos
```bash
# Importar la estructura de la base de datos
mysql -u tu_usuario -p nombre_de_tu_base_de_datos < database/schema.sql

# O ejecutar manualmente los scripts SQL en tu cliente MySQL
```

### 6. Iniciar el Servidor
```bash
npm start
# o
node server.js
```

El servidor estará disponible en: `http://localhost:3001`

## 📁 Estructura del Proyecto

```
backend/
├── config/
│   └── db.js              # Configuración de base de datos
├── controllers/            # Controladores de la aplicación
├── middleware/             # Middleware de autenticación
├── models/                 # Modelos de datos
├── routes/                 # Rutas de la API
├── public/                 # Archivos estáticos (frontend)
├── .env.example           # Ejemplo de variables de entorno
├── package.json           # Dependencias del proyecto
└── server.js              # Punto de entrada de la aplicación
```

## 🔐 Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `DB_HOST` | Host de la base de datos | `localhost` |
| `DB_USER` | Usuario de MySQL | `root` |
| `DB_PASSWORD` | Contraseña de MySQL | `` (vacío) |
| `DB_NAME` | Nombre de la base de datos | `veterilab2` |
| `DB_PORT` | Puerto de MySQL | `3306` |
| `PORT` | Puerto del servidor | `3001` |
| `JWT_SECRET` | Clave secreta para JWT | Requerido |

## 🛠️ Comandos Útiles

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar en modo producción
npm start

# Verificar sintaxis
npm run lint

# Ejecutar tests
npm test
```

## 🔧 Solución de Problemas

### Error de Conexión a Base de Datos
- Verificar que MySQL esté ejecutándose
- Confirmar credenciales en `.env`
- Verificar que la base de datos exista

### Error de Puerto en Uso
- Cambiar `PORT` en `.env`
- Verificar que no haya otro servicio usando el puerto

### Error de Módulos
- Ejecutar `npm install` nuevamente
- Verificar versión de Node.js

## 📚 API Endpoints

### Autenticación
- `POST /api/users/register` - Registrar usuario
- `POST /api/users/login` - Iniciar sesión

### Animales
- `GET /api/animals` - Obtener animales del usuario
- `POST /api/animals/register` - Registrar animal
- `GET /api/animals/especies/list` - Listar especies
- `GET /api/animals/razas/especie/:id` - Razas por especie

### Análisis
- `GET /api/analyses` - Obtener análisis del usuario
- `POST /api/analyses` - Solicitar análisis
- `GET /api/analyses/tipos` - Tipos de análisis disponibles

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes problemas o preguntas:
1. Revisa la sección de solución de problemas
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

---

**¡Disfruta desarrollando! 🚀** 