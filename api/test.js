// Test simple pour vérifier que Vercel détecte les fonctions dans api/
module.exports = (req, res) => {
  res.json({ 
    message: 'Test API fonctionne',
    timestamp: new Date().toISOString(),
    url: req.url
  });
};

