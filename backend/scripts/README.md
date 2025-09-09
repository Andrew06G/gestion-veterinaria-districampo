# Scripts de Utilidades

Esta carpeta contiene scripts de utilidades para el mantenimiento y administración del sistema.

## Scripts Disponibles

### 1. fix-password-column.js
**Propósito**: Expandir la columna de contraseña en la base de datos para acomodar hashes bcrypt.

**Uso**:
```bash
node scripts/fix-password-column.js
```

**Descripción**: Modifica la columna `contraseña` de la tabla `propietario` de `VARCHAR(50)` a `VARCHAR(255)` para permitir el almacenamiento de contraseñas hasheadas con bcrypt.

### 2. migrate-passwords.js
**Propósito**: Migrar contraseñas existentes de texto plano a hash bcrypt.

**Uso**:
```bash
# Verificar estado de las contraseñas
node scripts/migrate-passwords.js check

# Migrar todas las contraseñas a hash
node scripts/migrate-passwords.js migrate
```

**Descripción**: Convierte todas las contraseñas planas en la base de datos a hashes seguros usando bcrypt con 12 salt rounds.

### 3. validate-passwords.js
**Propósito**: Validar la fortaleza de las contraseñas en el sistema.

**Uso**:
```bash
# Validar todas las contraseñas
node scripts/validate-passwords.js validate

# Validar una contraseña específica
node scripts/validate-passwords.js test "MiContraseña123!"
```

**Descripción**: Analiza la fortaleza de las contraseñas según criterios de seguridad (longitud, complejidad, contraseñas comunes).

## Requisitos

- Node.js
- Acceso a la base de datos MySQL
- Variables de entorno configuradas en `.env`

## Notas de Seguridad

- Todos los scripts usan la configuración centralizada de base de datos
- Las contraseñas se hashean con bcrypt usando 12 salt rounds
- Los scripts incluyen validaciones de seguridad para contraseñas
