// Handler Vercel pour le backend Express
// Format simplifié pour Vercel serverless functions

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Importer les routes et le contenu
let siteContent, authRoutes, adminRoutes;

try {
  siteContent = require("../backend/src/data/siteContent");
  authRoutes = require("../backend/src/routes/auth");
  adminRoutes = require("../backend/src/routes/admin");
} catch (error) {
  console.error("❌ Erreur lors du chargement des modules:", error);
  // Export d'une app minimale en cas d'erreur
  const errorApp = express();
  errorApp.use(cors());
  errorApp.use(express.json());
  errorApp.all("*", (req, res) => {
    res.status(500).json({
      error: "Erreur de chargement des modules",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  });
  module.exports = errorApp;
  return;
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuration des uploads
const uploadsPath = process.env.VERCEL 
  ? path.join("/tmp", "uploads")
  : path.join(__dirname, "../backend/uploads");

// Créer les dossiers si nécessaire
try {
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
} catch (error) {
  console.warn("⚠️ Impossible de créer les dossiers uploads:", error.message);
}

// Servir les fichiers uploadés
app.use("/uploads", express.static(uploadsPath, {
  setHeaders: (res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=31536000");
  },
}));

// Route de test/santé
app.get("/", (req, res) => {
  res.json({
    name: siteContent.info.name,
    message: "API CAJJ opérationnelle",
    timestamp: new Date().toISOString(),
    vercel: !!process.env.VERCEL
  });
});

// Routes publiques
app.get("/about", (req, res) => {
  try {
    res.json(siteContent.about || { sections: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/actions", (req, res) => {
  try {
    res.json(siteContent.actions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/publications", (req, res) => {
  try {
    const publications = {
      cajj: (siteContent.publications?.cajj || []).filter((item) => item.visible !== false),
      partners: (siteContent.publications?.partners || []).filter((item) => item.visible !== false),
    };
    res.json(publications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/news", (req, res) => {
  try {
    const allNews = siteContent.news || [];
    const visibleNews = allNews.filter((item) => item.visible !== false);
    res.json(visibleNews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/gallery", (req, res) => {
  try {
    const allPhotos = siteContent.gallery?.photos || [];
    const allVideos = siteContent.gallery?.videos || [];
    const visiblePhotos = allPhotos.filter((item) => item.visible !== false);
    const visibleVideos = allVideos.filter((item) => item.visible !== false);
    
    res.json({
      photos: visiblePhotos,
      videos: visibleVideos,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/contact", (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Les champs nom, email et message sont requis." });
    }
    res.status(202).json({
      status: "received",
      data: { name, email, message },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes d'authentification et d'administration
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error("❌ Erreur:", err);
  res.status(500).json({
    error: "Erreur serveur",
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

// Export pour Vercel (handler serverless)
module.exports = app;
