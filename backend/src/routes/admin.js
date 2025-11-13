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
    visible: true, // Par défaut visible
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
    ...(req.body.hasOwnProperty("visible") && { visible: req.body.visible }),
  };

  res.json({ message: "Actualité mise à jour", news: siteContent.news[newsIndex] });
});

router.delete("/news/:id", (req, res) => {
  const { id } = req.params;

  siteContent.news = siteContent.news?.filter((n) => n.id !== id) || [];

  res.json({ message: "Actualité supprimée" });
});

router.patch("/news/:id/visibility", (req, res) => {
  const { id } = req.params;
  const { visible } = req.body;

  const newsIndex = siteContent.news?.findIndex((n) => n.id === id);

  if (newsIndex === -1) {
    return res.status(404).json({ error: "Actualité non trouvée" });
  }

  siteContent.news[newsIndex].visible = visible !== false;

  res.json({ message: `Actualité ${visible ? "publiée" : "masquée"}`, news: siteContent.news[newsIndex] });
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
  
  // Utiliser le chemin réel du fichier uploadé
  // req.file.path contient le chemin complet où multer a sauvegardé le fichier
  const actualFilePath = req.file.path;
  const filename = req.file.filename;
  
  // Construire l'URL relative depuis le dossier uploads
  // req.file.path devrait être quelque chose comme: .../uploads/photos/filename.jpg
  const uploadsBasePath = path.join(__dirname, "../../uploads");
  const relativePath = path.relative(uploadsBasePath, actualFilePath);
  const fileUrl = `/uploads/${relativePath.replace(/\\/g, "/")}`; // Normaliser les slashes pour Windows
  
  // Vérifier que le fichier existe bien
  const fileExists = fs.existsSync(actualFilePath);
  
  console.log("📸 Photo uploadée:", {
    filename: filename,
    originalname: req.file.originalname,
    multerPath: req.file.path,
    actualFilePath: actualFilePath,
    relativePath: relativePath,
    fileUrl: fileUrl,
    fileExists: fileExists,
    size: req.file.size,
    uploadsBasePath: uploadsBasePath
  });

  if (!fileExists) {
    console.error("❌ ERREUR: Le fichier n'existe pas après upload!", actualFilePath);
    return res.status(500).json({ 
      error: "Erreur lors de la sauvegarde du fichier",
      debug: {
        actualFilePath,
        fileExists,
        multerPath: req.file.path
      }
    });
  }

  const newPhoto = {
    id: Date.now().toString(),
    title: title || req.file.originalname,
    description: description || "",
    url: fileUrl,
    filename: filename,
    visible: true, // Par défaut visible
  };

  siteContent.gallery = siteContent.gallery || { videos: [], photos: [] };
  siteContent.gallery.photos = siteContent.gallery.photos || [];
  siteContent.gallery.photos.unshift(newPhoto);

  res.json({ 
    message: "Photo ajoutée", 
    photo: newPhoto,
    debug: {
      actualFilePath,
      fileExists,
      fileUrl: `${req.protocol}://${req.get("host")}${fileUrl}`
    }
  });
});

router.put("/gallery/photos/:id", (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const photoIndex = siteContent.gallery?.photos?.findIndex((p) => p.id === id);

  if (photoIndex === -1) {
    return res.status(404).json({ error: "Photo non trouvée" });
  }

  siteContent.gallery.photos[photoIndex] = {
    ...siteContent.gallery.photos[photoIndex],
    ...(title && { title }),
    ...(description !== undefined && { description }),
    ...(req.body.hasOwnProperty("visible") && { visible: req.body.visible }),
  };

  res.json({ message: "Photo mise à jour", photo: siteContent.gallery.photos[photoIndex] });
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

router.patch("/gallery/photos/:id/visibility", (req, res) => {
  const { id } = req.params;
  const { visible } = req.body;

  const photoIndex = siteContent.gallery?.photos?.findIndex((p) => p.id === id);

  if (photoIndex === -1) {
    return res.status(404).json({ error: "Photo non trouvée" });
  }

  siteContent.gallery.photos[photoIndex].visible = visible !== false;

  res.json({ message: `Photo ${visible ? "publiée" : "masquée"}`, photo: siteContent.gallery.photos[photoIndex] });
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
      visible: true, // Par défaut visible
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
    visible: true, // Par défaut visible
  };

  siteContent.gallery = siteContent.gallery || { videos: [], photos: [] };
  siteContent.gallery.videos = siteContent.gallery.videos || [];
  siteContent.gallery.videos.unshift(newVideo);

  res.json({ message: "Vidéo ajoutée", video: newVideo });
});

router.put("/gallery/videos/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, url } = req.body;

  const videoIndex = siteContent.gallery?.videos?.findIndex((v) => v.id === id);

  if (videoIndex === -1) {
    return res.status(404).json({ error: "Vidéo non trouvée" });
  }

  siteContent.gallery.videos[videoIndex] = {
    ...siteContent.gallery.videos[videoIndex],
    ...(title && { title }),
    ...(description !== undefined && { description }),
    ...(url && { url }),
    ...(req.body.hasOwnProperty("visible") && { visible: req.body.visible }),
  };

  res.json({ message: "Vidéo mise à jour", video: siteContent.gallery.videos[videoIndex] });
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

router.patch("/gallery/videos/:id/visibility", (req, res) => {
  const { id } = req.params;
  const { visible } = req.body;

  const videoIndex = siteContent.gallery?.videos?.findIndex((v) => v.id === id);

  if (videoIndex === -1) {
    return res.status(404).json({ error: "Vidéo non trouvée" });
  }

  siteContent.gallery.videos[videoIndex].visible = visible !== false;

  res.json({ message: `Vidéo ${visible ? "publiée" : "masquée"}`, video: siteContent.gallery.videos[videoIndex] });
});

// Routes pour les publications
router.get("/publications", (req, res) => {
  res.json(siteContent.publications || { cajj: [], partners: [] });
});

router.post("/publications/:type", (req, res) => {
  const { type } = req.params; // "cajj" ou "partners"
  const { title, description, url, name } = req.body;

  if (type !== "cajj" && type !== "partners") {
    return res.status(400).json({ error: "Type invalide. Utilisez 'cajj' ou 'partners'" });
  }

  if (!siteContent.publications) {
    siteContent.publications = { cajj: [], partners: [] };
  }

  const newPublication = {
    id: Date.now().toString(),
    ...(type === "cajj" ? { title, description, url } : { name, description, url }),
    visible: true, // Par défaut visible
  };

  siteContent.publications[type] = siteContent.publications[type] || [];
  siteContent.publications[type].unshift(newPublication);

  res.json({ message: "Publication ajoutée", publication: newPublication });
});

router.put("/publications/:type/:id", (req, res) => {
  const { type, id } = req.params;
  const { title, description, url, name } = req.body;

  if (type !== "cajj" && type !== "partners") {
    return res.status(400).json({ error: "Type invalide" });
  }

  const publicationIndex = siteContent.publications?.[type]?.findIndex((p) => p.id === id);

  if (publicationIndex === -1) {
    return res.status(404).json({ error: "Publication non trouvée" });
  }

  siteContent.publications[type][publicationIndex] = {
    ...siteContent.publications[type][publicationIndex],
    ...(title && { title }),
    ...(name && { name }),
    ...(description !== undefined && { description }),
    ...(url && { url }),
    ...(req.body.hasOwnProperty("visible") && { visible: req.body.visible }),
  };

  res.json({ message: "Publication mise à jour", publication: siteContent.publications[type][publicationIndex] });
});

router.delete("/publications/:type/:id", (req, res) => {
  const { type, id } = req.params;

  if (type !== "cajj" && type !== "partners") {
    return res.status(400).json({ error: "Type invalide" });
  }

  siteContent.publications[type] = siteContent.publications[type]?.filter((p) => p.id !== id) || [];

  res.json({ message: "Publication supprimée" });
});

router.patch("/publications/:type/:id/visibility", (req, res) => {
  const { type, id } = req.params;
  const { visible } = req.body;

  const publicationIndex = siteContent.publications?.[type]?.findIndex((p) => p.id === id);

  if (publicationIndex === -1) {
    return res.status(404).json({ error: "Publication non trouvée" });
  }

  siteContent.publications[type][publicationIndex].visible = visible !== false;

  res.json({
    message: `Publication ${visible ? "publiée" : "masquée"}`,
    publication: siteContent.publications[type][publicationIndex],
  });
});

// Routes pour la section "Nous connaître"
router.get("/about", (req, res) => {
  res.json(siteContent.about || { sections: [] });
});

router.put("/about/sections/:id", (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!siteContent.about) {
    siteContent.about = { sections: [] };
  }

  const sectionIndex = siteContent.about.sections?.findIndex((s) => s.id === id);

  if (sectionIndex === -1) {
    return res.status(404).json({ error: "Section non trouvée" });
  }

  siteContent.about.sections[sectionIndex] = {
    ...siteContent.about.sections[sectionIndex],
    ...(title && { title }),
    ...(content !== undefined && { content }),
  };

  res.json({
    message: "Section mise à jour",
    section: siteContent.about.sections[sectionIndex],
  });
});

module.exports = router;

