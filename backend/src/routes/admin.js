const express = require("express");
const fs = require("fs");
const path = require("path");
const { authenticateToken } = require("../middleware/auth");
const upload = require("../config/upload");
const siteContent = require("../data/siteContent");

const router = express.Router();

// Toutes les routes admin nécessitent une authentification
router.use(authenticateToken);

// Route pour obtenir toutes les données
router.get("/data", (req, res) => {
  res.json(siteContent);
});

// Routes pour les actualités
router.get("/news", (req, res) => {
  res.json(siteContent.news || []);
});

router.post("/news", (req, res) => {
  const { title, content, date, author } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Titre et contenu requis" });
  }

  const newNews = {
    id: Date.now().toString(),
    title,
    content,
    date: date || new Date().toISOString(),
    author: author || "CAJJ",
  };

  siteContent.news = siteContent.news || [];
  siteContent.news.unshift(newNews);

  res.json({ message: "Actualité ajoutée", news: newNews });
});

router.put("/news/:id", (req, res) => {
  const { id } = req.params;
  const { title, content, date, author } = req.body;

  const newsIndex = siteContent.news?.findIndex((n) => n.id === id);

  if (newsIndex === -1) {
    return res.status(404).json({ error: "Actualité non trouvée" });
  }

  siteContent.news[newsIndex] = {
    ...siteContent.news[newsIndex],
    ...(title && { title }),
    ...(content && { content }),
    ...(date && { date }),
    ...(author && { author }),
  };

  res.json({ message: "Actualité mise à jour", news: siteContent.news[newsIndex] });
});

router.delete("/news/:id", (req, res) => {
  const { id } = req.params;

  siteContent.news = siteContent.news?.filter((n) => n.id !== id) || [];

  res.json({ message: "Actualité supprimée" });
});

// Routes pour la galerie (photos)
router.get("/gallery/photos", (req, res) => {
  res.json(siteContent.gallery?.photos || []);
});

router.post("/gallery/photos", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Fichier requis" });
  }

  const { title, description } = req.body;
  const fileUrl = `/uploads/photos/${req.file.filename}`;

  const newPhoto = {
    id: Date.now().toString(),
    title: title || req.file.originalname,
    description: description || "",
    url: fileUrl,
    filename: req.file.filename,
  };

  siteContent.gallery = siteContent.gallery || { videos: [], photos: [] };
  siteContent.gallery.photos = siteContent.gallery.photos || [];
  siteContent.gallery.photos.unshift(newPhoto);

  res.json({ message: "Photo ajoutée", photo: newPhoto });
});

router.delete("/gallery/photos/:id", (req, res) => {
  const { id } = req.params;

  const photo = siteContent.gallery?.photos?.find((p) => p.id === id);
  if (photo && photo.filename) {
    const filePath = path.join(__dirname, "../../uploads/photos", photo.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  siteContent.gallery.photos = siteContent.gallery.photos?.filter((p) => p.id !== id) || [];

  res.json({ message: "Photo supprimée" });
});

// Routes pour la galerie (vidéos)
router.get("/gallery/videos", (req, res) => {
  res.json(siteContent.gallery?.videos || []);
});

router.post("/gallery/videos", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Fichier requis" });
  }

  const { title, description, url } = req.body;

  // Si c'est une URL externe (YouTube, Vimeo, etc.)
  if (url) {
    const newVideo = {
      id: Date.now().toString(),
      title: title || "Vidéo",
      description: description || "",
      url,
    };

    siteContent.gallery = siteContent.gallery || { videos: [], photos: [] };
    siteContent.gallery.videos = siteContent.gallery.videos || [];
    siteContent.gallery.videos.unshift(newVideo);

    return res.json({ message: "Vidéo ajoutée", video: newVideo });
  }

  // Si c'est un fichier uploadé
  const fileUrl = `/uploads/videos/${req.file.filename}`;

  const newVideo = {
    id: Date.now().toString(),
    title: title || req.file.originalname,
    description: description || "",
    url: fileUrl,
    filename: req.file.filename,
  };

  siteContent.gallery = siteContent.gallery || { videos: [], photos: [] };
  siteContent.gallery.videos = siteContent.gallery.videos || [];
  siteContent.gallery.videos.unshift(newVideo);

  res.json({ message: "Vidéo ajoutée", video: newVideo });
});

router.delete("/gallery/videos/:id", (req, res) => {
  const { id } = req.params;

  const video = siteContent.gallery?.videos?.find((v) => v.id === id);
  if (video && video.filename) {
    const filePath = path.join(__dirname, "../../uploads/videos", video.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  siteContent.gallery.videos = siteContent.gallery.videos?.filter((v) => v.id !== id) || [];

  res.json({ message: "Vidéo supprimée" });
});

module.exports = router;

