import api from "./api";

export const login = async (username, password) => {
  try {
    const response = await api.post("/api/auth/login", { username, password });
    if (response.data.token) {
      localStorage.setItem("admin_token", response.data.token);
    }
    return response.data;
  } catch (error) {
    // Gérer les erreurs de manière plus explicite
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      throw new Error(error.response.data?.message || "Erreur de connexion");
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      throw new Error("Impossible de contacter le serveur. Vérifiez votre connexion internet.");
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

