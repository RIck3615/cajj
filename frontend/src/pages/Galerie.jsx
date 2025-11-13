import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Images, Video } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeUp } from "@/lib/animations";
import api from "@/services/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const Galerie = () => {
  const [gallery, setGallery] = useState({ photos: [], videos: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await api.get("/api/gallery");
        console.log("Galerie chargée:", response.data);
        setGallery(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement de la galerie:", error);
        console.error("Détails:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  return (
    <motion.section
      className="container space-y-12 pb-16 pt-8 md:pt-12"
      {...fadeUp}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="space-y-3">
        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
          Galerie
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Nos actions en images
        </h1>
        <p className="max-w-3xl text-muted-foreground">
          Parcourez nos photos et vidéos pour plonger au cœur de nos interventions.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              Vidéos
            </CardTitle>
            <CardDescription>Capsules et témoignages illustrant nos actions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <p className="text-center text-muted-foreground">Chargement...</p>
            ) : gallery.videos.length === 0 ? (
              <p className="text-center text-muted-foreground">Aucune vidéo pour le moment.</p>
            ) : (
              gallery.videos.map((item) => (
                <div key={item.id} className="space-y-2 rounded-xl border border-border/60 p-4">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  )}
                  {item.url.startsWith("http") ? (
                    <Button variant="outline" className="gap-2" asChild>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        Regarder
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </Button>
                  ) : (
                    <video
                      src={`${API_URL}${item.url}`}
                      controls
                      className="w-full rounded-md"
                      style={{ maxHeight: "300px" }}
                    />
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Images className="h-5 w-5 text-primary" />
              Photos
            </CardTitle>
            <CardDescription>
              Moments capturés lors de nos initiatives sur le terrain.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground">Chargement...</p>
            ) : gallery.photos.length === 0 ? (
              <p className="text-center text-muted-foreground">Aucune photo pour le moment.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {gallery.photos.map((item) => {
                  const imageUrl = item.url.startsWith("http")
                    ? item.url
                    : `${API_URL}${item.url}`;
                  
                  console.log("Affichage photo:", { item, imageUrl, API_URL });
                  
                  return (
                    <div key={item.id} className="space-y-2 rounded-xl border border-border/60 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                        onLoad={() => {
                          console.log("✅ Image chargée avec succès:", imageUrl);
                        }}
                        onError={(e) => {
                          console.error("❌ Erreur chargement image:", imageUrl, item);
                          e.target.style.display = "none";
                          const errorDiv = e.target.nextElementSibling;
                          if (errorDiv) errorDiv.style.display = "flex";
                        }}
                      />
                      <div className="hidden h-48 items-center justify-center bg-muted text-muted-foreground">
                        <p className="text-sm">Image non disponible</p>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
};

export default Galerie;

