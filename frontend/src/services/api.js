import axios from "axios";

// Détection automatique de l'URL de l'API
function getApiUrl() {
  // 1. Vérifier la variable d'environnement (priorité)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // 2. Détection automatique basée sur l'URL actuelle
  const currentUrl = window.location.origin;
  
  // Si on est en production sur Hostinger
  if (currentUrl.includes("hostinger") || currentUrl.includes("hostingersite.com")) {
    // Utiliser /api/public/api car Laravel est dans /api/public/
    // et les routes sont préfixées avec /api
    return `${currentUrl}/api/public/api`;
  }
  
  // Si on est en production (vercel, netlify, etc.)
  if (currentUrl.includes("vercel.app") || currentUrl.includes("netlify.app") || currentUrl.includes("github.io")) {
    // Si VITE_API_URL est configuré, l'utiliser (backend déployé séparément)
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
    
    // Sinon, utiliser l'API relative (backend sur le même domaine)
    const relativeApiUrl = `${currentUrl}/api`;
    console.warn("⚠️ VITE_API_URL n'est pas configuré. Utilisation de l'API relative:", relativeApiUrl);
    console.warn("💡 Pour un backend séparé, configurez VITE_API_URL");
    return relativeApiUrl;
  }

  // 3. Si on est en développement local
  // Détecter si on est sur un autre appareil (IP locale)
  const hostname = window.location.hostname;
  
  // Si ce n'est pas localhost, utiliser le même hostname avec le port 8000 (Laravel)
  if (hostname !== "localhost" && hostname !== "127.0.0.1") {
    return `http://${hostname}:8000/api`;
  }

  // 4. Par défaut, utiliser localhost avec le port 8000 (Laravel)
  return "http://localhost:8000/api";
}

const API_URL = getApiUrl();

// Logs de diagnostic détaillés
console.group("🔗 Configuration API");
console.log("📍 URL actuelle du frontend:", window.location.origin);
console.log("🌐 Hostname:", window.location.hostname);
console.log("🔗 URL API détectée:", API_URL);
console.log("📝 Variable d'environnement VITE_API_URL:", import.meta.env.VITE_API_URL || "non définie");
console.groupEnd();

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

