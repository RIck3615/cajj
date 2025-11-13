const express = require("express");
const cors = require("cors");
const path = require("path");
const siteContent = require("./data/siteContent");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());

// Servir les fichiers uploadés (doit être avant les autres routes)
const uploadsPath = path.join(__dirname, "../uploads");
console.log("Serving uploads from:", uploadsPath);

// Vérifier que le dossier existe
const fs = require("fs");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log("Created uploads directory:", uploadsPath);
}

// Créer les sous-dossiers si nécessaire
const photosDir = path.join(uploadsPath, "photos");
const videosDir = path.join(uploadsPath, "videos");
if (!fs.existsSync(photosDir)) {
  fs.mkdirSync(photosDir, { recursive: true });
  console.log("Created photos directory:", photosDir);
}
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
  console.log("Created videos directory:", videosDir);
}

// Servir les fichiers statiques depuis le dossier uploads
// Cela permet d'accéder à /uploads/photos/file.jpg et /uploads/videos/file.mp4
app.use("/uploads", (req, res, next) => {
  // Log pour debug
  const requestedPath = path.join(uploadsPath, req.path);
  const exists = fs.existsSync(requestedPath);
  
  console.log("📁 Requête fichier:", {
    url: req.url,
    path: req.path,
    fullPath: requestedPath,
    exists: exists
  });
  
  // Si le fichier n'existe pas, retourner 404 immédiatement
  if (!exists) {
    console.error("❌ Fichier non trouvé:", requestedPath);
    return res.status(404).json({
      error: "Fichier non trouvé",
      path: req.path,
      fullPath: requestedPath,
      uploadsPath: uploadsPath
    });
  }
  
  next();
}, express.static(uploadsPath, {
  setHeaders: (res, filePath) => {
    // Permettre l'accès aux images depuis n'importe quelle origine
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=31536000");
  },
  dotfiles: "ignore",
  index: false
}));

// Route de test pour vérifier que les fichiers sont servis
app.get("/api/test-uploads", (req, res) => {
  const photosDir = path.join(uploadsPath, "photos");
  const videosDir = path.join(uploadsPath, "videos");
  
  const photos = fs.existsSync(photosDir) 
    ? fs.readdirSync(photosDir).map(f => {
        const filePath = path.join(photosDir, f);
        const stats = fs.statSync(filePath);
        return {
          name: f,
          path: `/uploads/photos/${f}`,
          size: stats.size,
          exists: true
        };
      })
    : [];
  const videos = fs.existsSync(videosDir)
    ? fs.readdirSync(videosDir).map(f => {
        const filePath = path.join(videosDir, f);
        const stats = fs.statSync(filePath);
        return {
          name: f,
          path: `/uploads/videos/${f}`,
          size: stats.size,
          exists: true
        };
      })
    : [];
  
  res.json({
    uploadsPath,
    photosDir,
    videosDir,
    photosDirExists: fs.existsSync(photosDir),
    videosDirExists: fs.existsSync(videosDir),
    photos,
    videos,
    photosCount: photos.length,
    videosCount: videos.length
  });
});

// Route pour tester si un fichier spécifique existe
app.get("/api/test-file/:type/:filename", (req, res) => {
  const { type, filename } = req.params;
  const filePath = path.join(uploadsPath, type, filename);
  const exists = fs.existsSync(filePath);
  
  if (exists) {
    const stats = fs.statSync(filePath);
    // Servir directement le fichier pour test
    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(500).json({
          exists: true,
          path: filePath,
          error: err.message
        });
      }
    });
  } else {
    res.status(404).json({
      exists: false,
      path: filePath,
      url: `/uploads/${type}/${filename}`,
      message: "Fichier non trouvé",
      uploadsPath,
      checkedPath: filePath
    });
  }
});

// Route racine
app.get("/", (_req, res) => {
  res.json({
    name: siteContent.info.name,
    message: "API CAJJ opérationnelle",
  });
});

// Route de santé pour Vercel
app.get("/api", (_req, res) => {
  res.json({
    name: siteContent.info.name,
    message: "API CAJJ opérationnelle",
  });
});

app.get("/api/about", (_req, res) => {
  res.json(siteContent.about || { sections: [] });
});

app.get("/api/actions", (_req, res) => {
  res.json(siteContent.actions);
});

app.get("/api/publications", (_req, res) => {
  // Retourner uniquement les publications visibles
  const publications = {
    cajj: (siteContent.publications?.cajj || []).filter((item) => item.visible !== false),
    partners: (siteContent.publications?.partners || []).filter((item) => item.visible !== false),
  };
  console.log("📚 API Publications - CAJJ:", publications.cajj.length, "Partenaires:", publications.partners.length);
  res.json(publications);
});

app.get("/api/news", (_req, res) => {
  // Retourner uniquement les actualités visibles
  const allNews = siteContent.news || [];
  const visibleNews = allNews.filter((item) => item.visible !== false);
  console.log("📰 API News - Total:", allNews.length, "Visibles:", visibleNews.length);
  res.json(visibleNews);
});

app.get("/api/gallery", (_req, res) => {
  // Retourner uniquement les médias visibles
  const allPhotos = siteContent.gallery?.photos || [];
  const allVideos = siteContent.gallery?.videos || [];
  const visiblePhotos = allPhotos.filter((item) => item.visible !== false);
  const visibleVideos = allVideos.filter((item) => item.visible !== false);
  
  console.log("🖼️ API Gallery - Photos totales:", allPhotos.length, "Visibles:", visiblePhotos.length);
  console.log("🎥 API Gallery - Vidéos totales:", allVideos.length, "Visibles:", visibleVideos.length);
  
  const gallery = {
    photos: visiblePhotos,
    videos: visibleVideos,
  };
  res.json(gallery);
});

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ error: "Les champs nom, email et message sont requis." });
    return;
  }

  res.status(202).json({
    status: "received",
    data: {
      name,
      email,
      message,
    },
  });
});

// Routes d'authentification
app.use("/api/auth", authRoutes);

// Routes d'administration
app.use("/api/admin", adminRoutes);

// Écouter sur toutes les interfaces réseau (0.0.0.0) pour être accessible depuis d'autres machines
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`🚀 CAJJ API ready on http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT}`);
  console.log(`📡 Accessible depuis le réseau local sur le port ${PORT}`);
  console.log(`💡 Pour accéder depuis un autre appareil, utilisez: http://[VOTRE_IP]:${PORT}`);
});



