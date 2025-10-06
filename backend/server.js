const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar tipos MIME para archivos estáticos
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path, stat) => {
    if (path.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
    } else if (path.endsWith('.css')) {
      res.set('Content-Type', 'text/css');
    } else if (path.endsWith('.html')) {
      res.set('Content-Type', 'text/html');
    }
  }
}));

// Importar rutas
const userRoutes = require('./src/routes/userRoutes');
const animalRoutes = require('./src/routes/animalRoutes');
const analysisRoutes = require('./src/routes/analysisRoutes');
const pdfRoutes = require('./src/routes/pdfRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');

// Importar rutas del módulo admin
const adminRoutes = require('./admin/src/routes/adminRoutes');

// Usar las rutas
app.use('/api/users', userRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api/analyses', analysisRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/notifications', notificationRoutes);

// Usar las rutas del admin
app.use('/api/admin', adminRoutes);

// Rutas para servir las páginas HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'login.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'register.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'dashboard.html'));
});

app.get('/animals', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'animals.html'));
});

app.get('/animal-info', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'animal_info.html'));
});

app.get('/solicitar-analisis', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'solicitar_analisis.html'));
});

app.get('/mis-analisis', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'mis_analisis.html'));
});

// Páginas del módulo Admin (estructura modular)
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'public', 'pages', 'admin_dashboard.html'));
});

app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'public', 'pages', 'admin_login.html'));
});

app.get('/admin/propietarios', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'public', 'pages', 'admin_propietarios.html'));
});

app.get('/admin/animales', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'public', 'pages', 'admin_animales.html'));
});

app.get('/admin/analisis', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'public', 'pages', 'admin_analisis.html'));
});

app.get('/admin/registro', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'public', 'pages', 'admin_registro.html'));
});

app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'test.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log('Rutas disponibles:');
  console.log('- /login - Página de inicio de sesión');
  console.log('- /register - Página de registro');
  console.log('- /dashboard - Dashboard principal');
  console.log('- /animals - Registro de animales');
  console.log('- /animal-info - Información de animales');
  console.log('- /solicitar-analisis - Solicitar análisis');
  console.log('- /mis-analisis - Mis análisis');
  console.log('- /admin - Admin Dashboard (beta)');
  console.log('- /admin/login - Admin Login (beta)');
  console.log('- /api/admin/login - API Login Admin');
  console.log('- /api/admin/profile - API Perfil Admin');
});