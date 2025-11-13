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

// Servir les fichiers uploadés
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (_req, res) => {
  res.json({
    name: siteContent.info.name,
    message: "API CAJJ opérationnelle",
  });
});

app.get("/api/about", (_req, res) => {
  res.json({
    info: siteContent.info,
    about: siteContent.about,
  });
});

app.get("/api/actions", (_req, res) => {
  res.json(siteContent.actions);
});

app.get("/api/publications", (_req, res) => {
  res.json(siteContent.publications);
});

app.get("/api/news", (_req, res) => {
  res.json(siteContent.news);
});

app.get("/api/gallery", (_req, res) => {
  res.json(siteContent.gallery);
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

app.listen(PORT, () => {
  console.log(`CAJJ API ready on port ${PORT}`);
});



