# Aplicación Web para la Gestión Integral de Servicios de Laboratorio Veterinario para Districampo

Este proyecto se enfoca en el desarrollo de una aplicación web para la gestión integral de servicios de laboratorio veterinario, diseñada para optimizar los procesos de diagnóstico en la Tienda Agropecuaria Districampo, ubicada en La Virginia, Risaralda. La solución busca mejorar la eficiencia y trazabilidad de los procesos diagnósticos.

## Problema Resuelto

La prestación de servicios veterinarios enfrenta obstáculos que dificultan la obtención de diagnósticos accesibles y rápidos, especialmente en áreas rurales como La Virginia, donde los desplazamientos generan demoras, costos elevados y riesgo de daño a las muestras. Además, existe una limitada integración tecnológica y de seguimiento en estos procedimientos.

Este proyecto propone una solución digital integral que permite programar la toma de muestras a domicilio, agilizar la coordinación con laboratorios aliados para el procesamiento y digitalizar la atención, ofreciendo una respuesta más rápida y cómoda para el usuario final.

## Justificación

La iniciativa surge de la necesidad de optimizar el método de análisis veterinario en áreas rurales, donde los servicios se enfrentan a problemas de logística, carencia de laboratorios equipados y poca tecnología para el manejo de muestras. La plataforma web facilitará la conexión entre la recolección de muestras a domicilio y su análisis en laboratorios asociados, centralizando el flujo de datos de manera intuitiva, rastreable y segura.

### Justificación Técnica
La aplicación busca transformar digitalmente cada etapa del procedimiento, desde el pedido de servicios hasta la presentación de los resultados, acortando los plazos de respuesta y mejorando el seguimiento e identificación de los especímenes.

### Justificación Operativa
Al eliminar desplazamientos innecesarios de los animales, se reduce el estrés, se mejora la experiencia del usuario y se amplía el acceso a diagnósticos, especialmente en zonas rurales.

### Justificación Económica
Al establecer relaciones comerciales con laboratorios veterinarios aliados, se reduce la necesidad de una inversión significativa en infraestructura propia de laboratorio, facilitando la sostenibilidad del servicio. El mercado global de atención veterinaria móvil está proyectado a crecer, respaldando la viabilidad de este tipo de soluciones.

## Alcance del Proyecto

El proyecto tiene como objetivo el diseño, desarrollo, validación e implementación de una aplicación web integral para la gestión de servicios de laboratorio veterinario digital. Districampo, en La Virginia (Risaralda), será la empresa piloto para la implementación y validación.

La aplicación centralizará el proceso desde la solicitud del análisis clínico y la gestión de muestras, hasta la emisión de resultados en PDF, eliminando la necesidad de traslados físicos al laboratorio.

### Funcionalidades Clave

La plataforma integrará las siguientes funcionalidades organizadas en módulos:

* **Módulo de Usuarios:** Registro, inicio de sesión y administración de datos personales.
* **Módulo de Mascotas:** Creación, edición y eliminación de registros de mascotas.
* **Módulo de Análisis:** Solicitud de servicios, seguimiento del estado de análisis, historial de exámenes.
* **Módulo de Resultados:** Carga y generación de reportes en formato PDF.
* **Módulo Administrativo:** Control de citas y auditoría de datos para Districampo.

### Delimitación Geográfica
La implementación se realizará en La Virginia y Cerritos (Risaralda), zonas de influencia directa de Districampo, simulando condiciones de uso reales en entornos rurales.

## Diagrama de Flujo de la Aplicación

A continuación se presenta un diagrama de flujo que ilustra la navegación principal y las interacciones del usuario dentro de la aplicación.

```mermaid
---
config:
  layout: dagre
---
flowchart TD
    A["Inicio"] --> B{"Pestaña Inicial: Login"}
    B -- Registrarse --> C["Pestaña de Registro de Usuario"]
    B -- Ya tiene cuenta --> D["Pestaña del Dashboard Principal"]
    C --> D
    D -- Registro de Animales --> E["Pestaña de Registro de Animales"]
    D -- Solicitar Análisis --> F["Pestaña de Solicitud de Análisis"]
    D -- Gestión de Análisis --> G["Pestaña de Gestionar Análisis"]
    E --> D
    F -- Seleccionar Animal y Tipo de Análisis, Fecha --> H["Cita Agendada para Toma de Muestra"]
    F --> D
    G -- Seleccionar Animal y Examen --> I["Visualización de Resultados en Tabla"]
    G --> D
    H --> G
**
Puedes encontrar el código fuente de este diagrama en docs/architecture/Diagrama General de la App.mmd.

Una representación visual de este flujo es la siguiente:

(Asegúrate de que 'diagrama-captura.png' sea el nombre exacto de tu archivo de imagen.)

Estructura de la Base de Datos
La estructura completa de la base de datos se encuentra definida en el archivo docs/database/schema.sql. Este script contiene la definición de todas las tablas, sus columnas, tipos de datos, claves primarias y foráneas, y todas las restricciones necesarias para recrear la base de datos veterilab2.

Tecnologías Utilizadas
Backend: Node.js, Express.js (lógica de negocio y API)
Base de datos: MySQL
Frontend: HTML, CSS, JavaScript, Bootstrap
Generación de reportes PDF: PDFKit
Consumo de API: Axios
Control de versiones: Git, GitHub
Entorno de desarrollo: Visual Studio Code
Pruebas de API: Postman
Despliegue: AWS Lightsail (instancia básica)
Configuración del Entorno de Desarrollo
Para poner en marcha el proyecto localmente, sigue estos pasos:

Clonar el repositorio:

Bash

git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
(Asegúrate de reemplazar YOUR_GITHUB_USERNAME y YOUR_REPO_NAME con los datos de tu repositorio).

Configuración de la Base de Datos:

Asegúrate de tener MySQL instalado y funcionando.
Crea una nueva base de datos llamada veterilab2.
Importa el esquema de la base de datos utilizando el archivo docs/database/schema.sql. Puedes hacerlo desde tu gestor de base de datos (MySQL Workbench, phpMyAdmin) o desde la línea de comandos:
Bash

mysql -u tu_usuario_mysql -p veterilab2 < docs/database/schema.sql
(Reemplaza tu_usuario_mysql con tu usuario de MySQL).
Configuración del Backend:

Bash

cd backend
npm install
# Crea un archivo .env en la carpeta backend con tus credenciales de DB:
# DB_HOST=localhost
# DB_USER=tu_usuario_mysql
# DB_PASSWORD=tu_contraseña_mysql
# DB_NAME=veterilab2
npm start # Para iniciar el servidor de desarrollo
Configuración del Frontend:

Bash

cd frontend
# Dependiendo de tu setup de frontend, podrías no necesitar npm install aquí.
# Si tus archivos HTML/CSS/JS son estáticos, simplemente ábrelos con un navegador.
# Si usas un servidor de desarrollo para el frontend (ej. Live Server en VS Code), inícialo.
Contribuciones
Este es un proyecto académico desarrollado por:

DAVID RICARDO RIVERA ARBELAEZ
DANIEL FELIPE COLORADO AMAYA
ANDREW LOAIZA GUZMAN
Licencia
Todos los derechos reservados. Este proyecto es para fines académicos y no se permite su uso o distribución comercial sin autorización expresa.