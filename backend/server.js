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

// Usar las rutas
app.use('/api/users', userRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api/analyses', analysisRoutes);
app.use('/api/pdf', pdfRoutes);

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

app.get('/solicitar-analisis', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'solicitar_analisis.html'));
});

app.get('/mis-analisis', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'mis_analisis.html'));
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
  console.log('- /animals - Gestión de animales');
  console.log('- /solicitar-analisis - Solicitar análisis');
  console.log('- /mis-analisis - Mis análisis');
});