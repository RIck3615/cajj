import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { login } from "@/services/auth";
import { API_URL } from "@/services/api";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking"); // "checking", "online", "offline"
  const navigate = useNavigate();

  // Vérifier la connexion au backend au chargement
  useEffect(() => {
    console.log("🔗 URL API détectée:", API_URL);
    console.log("📍 URL actuelle du frontend:", window.location.origin);
    
    // Tester la connexion au backend
    setBackendStatus("checking");
    fetch(`${API_URL}/`, { 
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        'Accept': 'application/json',
      }
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(`Réponse non OK: ${res.status} ${res.statusText}`);
      })
      .then((data) => {
        console.log("✅ Backend accessible:", data);
        setBackendStatus("online");
      })
      .catch((err) => {
        console.error("❌ Backend inaccessible:", err);
        console.error("URL testée:", API_URL);
        console.error("Type d'erreur:", err.name);
        console.error("Message:", err.message);
        setBackendStatus("offline");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password);
      navigate("/admin");
    } catch (err) {
      // Gérer les erreurs de manière plus claire
      let errorMessage = err.message || err.response?.data?.message || err.response?.data?.error || "Erreur de connexion";
      
      // Afficher l'URL de l'API dans l'erreur pour aider au diagnostic
      if (errorMessage.includes("Impossible de contacter")) {
        errorMessage += `\n\nURL API utilisée: ${API_URL}`;
      }
      
      setError(errorMessage);
      console.error("Erreur de connexion:", err);
      console.error("URL API:", API_URL);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Espace Administrateur</CardTitle>
            <p className="text-sm text-muted-foreground">Connectez-vous pour gérer le contenu du site</p>
            
            {/* Indicateur de statut du backend */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs">
              {backendStatus === "checking" && (
                <span className="text-muted-foreground">Vérification de la connexion...</span>
              )}
              {backendStatus === "online" && (
                <span className="flex items-center gap-1 text-green-600">
                  <span className="h-2 w-2 rounded-full bg-green-600"></span>
                  Backend connecté ({API_URL})
                </span>
              )}
              {backendStatus === "offline" && (
                <span className="flex items-center gap-1 text-destructive">
                  <span className="h-2 w-2 rounded-full bg-destructive"></span>
                  Backend inaccessible ({API_URL})
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Nom d'utilisateur
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  className="w-full rounded-md border border-input bg-background px-3 py-3 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Entrez votre nom d'utilisateur"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full rounded-md border border-input bg-background px-3 py-3 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Entrez votre mot de passe"
                  required
                />
              </div>
                  {error && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive whitespace-pre-line">
                      <div className="font-semibold mb-2">❌ Erreur de connexion</div>
                      <div>{error}</div>
                      <div className="mt-3 pt-3 border-t border-destructive/20 text-xs">
                        <div className="font-semibold mb-1">💡 Solutions possibles :</div>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Vérifiez que le backend Laravel est démarré : <code className="bg-destructive/20 px-1 rounded">cd backend-laravel && php artisan serve</code></li>
                          <li>Vérifiez l'URL de l'API dans la console (F12)</li>
                          <li>Si vous êtes sur un autre ordinateur, créez <code className="bg-destructive/20 px-1 rounded">frontend/.env</code> avec <code className="bg-destructive/20 px-1 rounded">VITE_API_URL=http://[IP]:8000/api</code></li>
                        </ul>
                      </div>
                    </div>
                  )}
              <Button type="submit" className="w-full py-3 text-base" disabled={loading}>
                <LogIn className="mr-2 h-4 w-4" />
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLogin;

