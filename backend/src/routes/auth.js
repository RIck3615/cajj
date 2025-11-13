const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../middleware/auth");

const router = express.Router();

// Utilisateur admin par défaut (à changer en production)
const ADMIN_USER = {
  username: process.env.ADMIN_USERNAME || "admin",
  password: process.env.ADMIN_PASSWORD || "admin123", // À changer absolument !
};

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Nom d'utilisateur et mot de passe requis" });
  }

  if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
    const token = jwt.sign({ username: ADMIN_USER.username }, JWT_SECRET, {
      expiresIn: "24h",
    });

    return res.json({
      token,
      user: { username: ADMIN_USER.username },
    });
  }

  res.status(401).json({ error: "Identifiants incorrects" });
});

module.exports = router;

