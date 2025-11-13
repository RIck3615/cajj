import api from "./api";

export const login = async (username, password) => {
  try {
    const response = await api.post("/api/auth/login", { username, password });
    if (response.data.token) {
      localStorage.setItem("admin_token", response.data.token);
    }
    return response.data;
  } catch (error) {
    // Utiliser le message d'erreur amélioré de l'intercepteur si disponible
    if (error.message && error.message.includes("Impossible de contacter le serveur")) {
      throw error; // L'intercepteur a déjà formaté le message
    }
    
    // Gérer les erreurs de manière plus explicite
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      const errorMessage = error.response.data?.error || error.response.data?.message || "Erreur de connexion";
      throw new Error(errorMessage);
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      const apiUrl = error.config?.baseURL || "le serveur";
      throw new Error(
        `Impossible de contacter le serveur à l'adresse ${apiUrl}.\n\n` +
        `Vérifiez que :\n` +
        `1. Le backend est démarré (cd backend && npm run dev)\n` +
        `2. Le backend écoute sur le port 4000\n` +
        `3. L'URL de l'API est correcte (voir la console du navigateur)`
      );
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      throw new Error("Erreur lors de la connexion: " + error.message);
    }
  }
};

export const logout = () => {
  localStorage.removeItem("admin_token");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("admin_token");
};

