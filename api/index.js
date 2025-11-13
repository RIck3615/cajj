// Handler Vercel pour le backend Express
// Ce fichier permet à Vercel de déployer le backend comme serverless function

// Vercel passe les requêtes via req et res, pas besoin de créer un serveur
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Importer les routes et le contenu
const siteContent = require("../backend/src/data/siteContent");
const authRoutes = require("../backend/src/routes/auth");
const adminRoutes = require("../backend/src/routes/admin");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuration des uploads (pour Vercel, on utilisera /tmp car c'est le seul dossier accessible en écriture)
const uploadsPath = process.env.VERCEL 
  ? path.join("/tmp", "uploads")
  : path.join(__dirname, "../backend/uploads");

// Créer les dossiers si nécessaire
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

const photosDir = path.join(uploadsPath, "photos");
const videosDir = path.join(uploadsPath, "videos");
if (!fs.existsSync(photosDir)) {
  fs.mkdirSync(photosDir, { recursive: true });
}
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

// Servir les fichiers uploadés
app.use("/uploads", express.static(uploadsPath, {
  setHeaders: (res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=31536000");
  },
}));

// Routes publiques
// Note: Vercel route déjà /api/* vers ce handler, donc les routes ici sont relatives à /api
app.get("/", (_req, res) => {
  res.json({
    name: siteContent.info.name,
    message: "API CAJJ opérationnelle",
  });
});

app.get("/about", (_req, res) => {
  res.json(siteContent.about || { sections: [] });
});

app.get("/actions", (_req, res) => {
  res.json(siteContent.actions);
});

app.get("/publications", (_req, res) => {
  const publications = {
    cajj: (siteContent.publications?.cajj || []).filter((item) => item.visible !== false),
    partners: (siteContent.publications?.partners || []).filter((item) => item.visible !== false),
  };
  res.json(publications);
});

app.get("/news", (_req, res) => {
  const allNews = siteContent.news || [];
  const visibleNews = allNews.filter((item) => item.visible !== false);
  res.json(visibleNews);
});

app.get("/gallery", (_req, res) => {
  const allPhotos = siteContent.gallery?.photos || [];
  const allVideos = siteContent.gallery?.videos || [];
  const visiblePhotos = allPhotos.filter((item) => item.visible !== false);
  const visibleVideos = allVideos.filter((item) => item.visible !== false);
  
  const gallery = {
    photos: visiblePhotos,
    videos: visibleVideos,
  };
  res.json(gallery);
});

app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Les champs nom, email et message sont requis." });
  }
  res.status(202).json({
    status: "received",
    data: { name, email, message },
  });
});

// Routes d'authentification et d'administration
// Vercel route /api/* vers ce handler, donc /api/auth devient /auth ici
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

// Export pour Vercel (handler serverless)
module.exports = app;
