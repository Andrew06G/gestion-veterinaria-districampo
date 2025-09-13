# Scripts de Utilidades

Esta carpeta contiene scripts de utilidades para el mantenimiento y administración del sistema.

## Scripts Disponibles

### 1. validate-passwords.js
**Propósito**: Validar la fortaleza de las contraseñas en el sistema.

**Uso**:
```bash
# Validar todas las contraseñas
node scripts/validate-passwords.js validate

# Validar una contraseña específica
node scripts/validate-passwords.js test "MiContraseña123!"
```

**Descripción**: Analiza la fortaleza de las contraseñas según criterios de seguridad (longitud, complejidad, contraseñas comunes).

## Migración de Seguridad Completada

Los siguientes scripts de migración fueron ejecutados exitosamente y luego eliminados:

- **fix-password-column.js**: Expandió la columna `contraseña` de `VARCHAR(50)` a `VARCHAR(255)` para acomodar hashes bcrypt.
- **migrate-passwords.js**: Migró todas las contraseñas de texto plano a hashes seguros usando bcrypt con 12 salt rounds.

**Estado actual**: Todas las contraseñas en el sistema están protegidas con hash bcrypt.

## Requisitos

- Node.js
- Acceso a la base de datos MySQL
- Variables de entorno configuradas en `.env`

## Notas de Seguridad

- Todos los scripts usan la configuración centralizada de base de datos
- Las contraseñas se hashean con bcrypt usando 12 salt rounds
- Los scripts incluyen validaciones de seguridad para contraseñas
- El sistema maneja tanto contraseñas hasheadas como planas durante la transición
