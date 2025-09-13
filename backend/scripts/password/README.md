# Scripts de Contraseñas

Esta carpeta contiene scripts para la gestión y validación de contraseñas.

## Scripts Disponibles

### `validate-passwords.js`
Script para validar la fortaleza de las contraseñas en el sistema.

**Uso**:
```bash
# Validar todas las contraseñas del sistema
node scripts/password/validate-passwords.js validate

# Validar una contraseña específica
node scripts/password/validate-passwords.js test "MiContraseña123!"
```

**Funcionalidades**:
- Análisis de fortaleza de contraseñas
- Validación de criterios de seguridad
- Detección de contraseñas comunes
- Reportes de seguridad

## Estado Actual

- **Algoritmo**: bcrypt con 12 salt rounds
- **Validación**: Frontend y backend
- **Criterios**: Longitud mínima, complejidad, caracteres especiales
- **Seguridad**: Todas las contraseñas están hasheadas

## Criterios de Validación

1. **Longitud mínima**: 8 caracteres
2. **Complejidad**: Al menos 3 de los siguientes:
   - Letras minúsculas
   - Letras mayúsculas
   - Números
   - Caracteres especiales
3. **Contraseñas comunes**: Bloqueadas
4. **Patrones débiles**: Detectados y rechazados
