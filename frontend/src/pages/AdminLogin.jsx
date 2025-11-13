import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { login } from "@/services/auth";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Debug: afficher l'URL de l'API au chargement
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
    console.log("🔗 URL API configurée:", API_URL);
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
      const errorMessage = err.message || err.response?.data?.message || err.response?.data?.error || "Erreur de connexion";
      setError(errorMessage);
      console.error("Erreur de connexion:", err);
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
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
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

