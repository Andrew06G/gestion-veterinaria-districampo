# Scripts de Utilidades

Esta carpeta contiene scripts de utilidades para el mantenimiento y administración del sistema, organizados por funcionalidad.

## Estructura de Carpetas

### 📁 `password/`
Scripts relacionados con la gestión de contraseñas y seguridad de autenticación.

### 📁 `notifications/`
Scripts relacionados con el sistema de notificaciones y persistencia de datos.


## Scripts Disponibles

### 🔐 Password Security

#### `password/validate-passwords.js`
**Propósito**: Validar la fortaleza de las contraseñas en el sistema.

**Uso**:
```bash
# Validar todas las contraseñas
node scripts/password/validate-passwords.js validate

# Validar una contraseña específica
node scripts/password/validate-passwords.js test "MiContraseña123!"
```

**Descripción**: Analiza la fortaleza de las contraseñas según criterios de seguridad (longitud, complejidad, contraseñas comunes).

### 🔔 Notifications System

#### `setup-notifications.js`
**Propósito**: Configurar el sistema de notificaciones en la base de datos.

**Uso**:
```bash
# Configurar tabla de notificaciones
node scripts/setup-notifications.js
```

**Descripción**: Crea la tabla `notifications` con índices optimizados y datos de prueba para el sistema de notificaciones por usuario.

#### `create_notifications_table.sql`
**Propósito**: Script SQL para crear la tabla de notificaciones manualmente.

**Uso**:
```sql
-- Ejecutar en MySQL
SOURCE scripts/create_notifications_table.sql;
```

**Descripción**: Script SQL directo para crear la tabla de notificaciones con todas las restricciones y índices necesarios.


## Estado de Seguridad Actual

### ✅ Contraseñas
- Todas las contraseñas están protegidas con hash bcrypt (12 salt rounds)
- Validación de fortaleza implementada en el frontend y backend
- Migración de contraseñas planas completada

### ✅ Datos Sensibles
- Cifrado AES-256-CBC implementado para datos sensibles
- Campos cifrados: emails, teléfonos, direcciones, nombres de animales
- IV aleatorio para cada cifrado
- Descifrado automático en consultas

### ✅ Autenticación
- JWT con clave segura configurada
- Tokens con expiración de 24 horas
- Middleware de autenticación implementado

### ✅ Notificaciones
- Sistema de notificaciones por usuario implementado
- Persistencia en base de datos MySQL
- API REST completa para gestión de notificaciones
- Interfaz de usuario responsive y funcional

## Requisitos

- Node.js
- Acceso a la base de datos MySQL
- Variables de entorno configuradas en `.env`

## Variables de Entorno Requeridas

```env
# Base de datos
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=veterilab2
DB_PORT=3306

# Servidor
PORT=3001
NODE_ENV=development

# Seguridad
JWT_SECRET=contraseña_personal
ENCRYPTION_KEY=your_32_byte_hex_key_here
```
