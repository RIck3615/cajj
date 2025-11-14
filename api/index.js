// Handler Vercel serverless function
// Format simplifié et robuste

module.exports = async (req, res) => {
  // Log immédiat pour vérifier que la fonction est appelée
  console.log('🚀 FONCTION SERVERLESS APPELÉE:', {
    url: req.url,
    method: req.method,
    path: req.path,
    timestamp: new Date().toISOString(),
    vercel: !!process.env.VERCEL
  });
  
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Gérer les requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    console.log('✅ OPTIONS request handled');
    return res.status(200).end();
  }

  try {
    // Importer Express et les modules
    const express = require('express');
    const cors = require('cors');
    const path = require('path');
    const fs = require('fs');

    // Créer l'app Express
    const app = express();
    app.use(cors());
    app.use(express.json());
    
    // Middleware pour normaliser le chemin : retirer /api si présent
    // Quand Vercel fait un rewrite vers cette fonction, req.url contient déjà /api/...
    // Il faut l'enlever pour que les routes Express fonctionnent correctement
    app.use((req, res, next) => {
      const originalUrl = req.url;
      
      // Normaliser req.url en retirant /api
      if (req.url.startsWith('/api/')) {
        req.url = req.url.replace('/api', '');
      } else if (req.url === '/api' || req.url === '/api/') {
        req.url = '/';
      }
      
      // Si le chemin est vide, utiliser /
      if (!req.url || req.url === '') {
        req.url = '/';
      }
      
      // Note: req.path est recalculé automatiquement par Express à partir de req.url
      console.log('📡 Requête API:', {
        originalUrl,
        normalizedUrl: req.url,
        path: req.path, // Sera recalculé automatiquement
        method: req.method
      });
      
      next();
    });

    // Importer les routes et le contenu
    const siteContent = require('../backend/src/data/siteContent');
    const authRoutes = require('../backend/src/routes/auth');
    const adminRoutes = require('../backend/src/routes/admin');

    // Configuration des uploads
    const uploadsPath = process.env.VERCEL 
      ? path.join('/tmp', 'uploads')
      : path.join(__dirname, '../backend/uploads');

    // Créer les dossiers si nécessaire
    try {
      if (!fs.existsSync(uploadsPath)) {
        fs.mkdirSync(uploadsPath, { recursive: true });
      }
      const photosDir = path.join(uploadsPath, 'photos');
      const videosDir = path.join(uploadsPath, 'videos');
      if (!fs.existsSync(photosDir)) {
        fs.mkdirSync(photosDir, { recursive: true });
      }
      if (!fs.existsSync(videosDir)) {
        fs.mkdirSync(videosDir, { recursive: true });
      }
    } catch (error) {
      console.warn('⚠️ Impossible de créer les dossiers uploads:', error.message);
    }

    // Servir les fichiers uploadés
    app.use('/uploads', express.static(uploadsPath, {
      setHeaders: (res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
      },
    }));

    // Route de test/santé
    app.get('/', (req, res) => {
      res.json({
        name: siteContent.info.name,
        message: 'API CAJJ opérationnelle',
        timestamp: new Date().toISOString(),
        vercel: !!process.env.VERCEL
      });
    });

    // Routes publiques
    app.get('/about', (req, res) => {
      res.json(siteContent.about || { sections: [] });
    });

    app.get('/actions', (req, res) => {
      res.json(siteContent.actions);
    });

    app.get('/publications', (req, res) => {
      const publications = {
        cajj: (siteContent.publications?.cajj || []).filter((item) => item.visible !== false),
        partners: (siteContent.publications?.partners || []).filter((item) => item.visible !== false),
      };
      res.json(publications);
    });

    app.get('/news', (req, res) => {
      const allNews = siteContent.news || [];
      const visibleNews = allNews.filter((item) => item.visible !== false);
      res.json(visibleNews);
    });

    app.get('/gallery', (req, res) => {
      const allPhotos = siteContent.gallery?.photos || [];
      const allVideos = siteContent.gallery?.videos || [];
      const visiblePhotos = allPhotos.filter((item) => item.visible !== false);
      const visibleVideos = allVideos.filter((item) => item.visible !== false);
      
      res.json({
        photos: visiblePhotos,
        videos: visibleVideos,
      });
    });

    app.post('/contact', (req, res) => {
      const { name, email, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Les champs nom, email et message sont requis.' });
      }
      res.status(202).json({
        status: 'received',
        data: { name, email, message },
      });
    });

    // Routes d'authentification et d'administration
    app.use('/auth', authRoutes);
    app.use('/admin', adminRoutes);

    // Gestion des erreurs
    app.use((err, req, res, next) => {
      console.error('❌ Erreur:', err);
      res.status(500).json({
        error: 'Erreur serveur',
        message: err.message
      });
    });

    // Gérer la requête avec Express
    return app(req, res);

  } catch (error) {
    console.error('❌ Erreur fatale:', error);
    console.error('Stack:', error.stack);
    return res.status(500).json({
      error: 'Erreur de chargement',
      message: error.message,
      details: error.toString(),
      stack: process.env.VERCEL ? error.stack : undefined,
      path: error.path || 'N/A',
      code: error.code || 'N/A'
    });
  }
};
