import axios from "axios";

// Détection automatique de l'URL de l'API
function getApiUrl() {
  // 1. Vérifier la variable d'environnement (priorité)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // 2. Détection automatique basée sur l'URL actuelle
  const currentUrl = window.location.origin;
  
  // Si on est en production (vercel, netlify, etc.)
  if (currentUrl.includes("vercel.app") || currentUrl.includes("netlify.app") || currentUrl.includes("github.io")) {
    // En production, utiliser l'URL du backend déployé
    // Vous devrez configurer VITE_API_URL dans Vercel
    console.warn("⚠️ VITE_API_URL n'est pas configuré. Configurez-le dans les variables d'environnement de votre plateforme de déploiement.");
    return "http://localhost:4000"; // Fallback
  }

  // 3. Si on est en développement local
  // Détecter si on est sur un autre appareil (IP locale)
  const hostname = window.location.hostname;
  
  // Si ce n'est pas localhost, utiliser le même hostname avec le port 4000
  if (hostname !== "localhost" && hostname !== "127.0.0.1") {
    return `http://${hostname}:4000`;
  }

  // 4. Par défaut, utiliser localhost
  return "http://localhost:4000";
}

const API_URL = getApiUrl();

console.log("🔗 URL API détectée:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // Timeout de 10 secondes
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("⏱️ Timeout: Le serveur met trop de temps à répondre");
      error.message = "Le serveur met trop de temps à répondre. Vérifiez que le backend est démarré.";
    } else if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
      console.error("🌐 Erreur réseau: Impossible de contacter le serveur");
      error.message = `Impossible de contacter le serveur à l'adresse ${API_URL}. Vérifiez que le backend est démarré et accessible.`;
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_URL };

