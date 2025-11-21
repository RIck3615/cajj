import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeUp } from "@/lib/animations";
import api from "@/services/api";
import { FileText, Download, Eye } from "lucide-react";

const Documentation = () => {
  const [documentations, setDocumentations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    const fetchDocumentations = async () => {
      try {
        const response = await api.get("/documentations");
        console.log("Documentations chargées:", response.data);
        setDocumentations(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des documentations:", error);
        console.error("Détails:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentations();
  }, []);

  const getPdfUrl = (pdfUrl) => {
    if (!pdfUrl) return null;
    
    // Si c'est déjà une URL complète (http/https)
    if (pdfUrl.startsWith("http")) {
      return pdfUrl;
    }
    
    // Si c'est un chemin /storage/
    if (pdfUrl.startsWith("/storage/")) {
      const currentUrl = window.location.origin;
      const hostname = window.location.hostname;
      
      // Détection Hostinger
      if (hostname.includes("hostinger") || hostname.includes("hostingersite.com") || hostname.includes("cajjrdc.com") || currentUrl.includes("hostinger") || currentUrl.includes("hostingersite.com") || currentUrl.includes("cajjrdc.com")) {
        // Sur Hostinger, utiliser la route web (pas API) pour servir les fichiers storage
        return `${currentUrl}/api/public${pdfUrl}`;
      } else {
        // En développement, utiliser l'API Laravel
        const API_URL = window.location.origin + "/api";
        return `${API_URL}${pdfUrl}`;
      }
    }
    
    // Par défaut, retourner tel quel
    return pdfUrl;
  };

  return (
    <motion.section
      className="container space-y-12 pb-16 pt-8 md:pt-12"
      {...fadeUp}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="space-y-3">
        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
          Documentation
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Documentation du CAJJ
        </h1>
        <p className="max-w-3xl text-muted-foreground">
          Accédez à tous nos documents PDF : rapports, études, guides et ressources documentaires.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-muted/40 p-10 text-center text-muted-foreground">
          Chargement de la documentation...
        </div>
      ) : documentations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-muted/40 p-10 text-center text-muted-foreground">
          Aucune documentation disponible pour le moment.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {documentations.map((doc) => {
            const pdfUrl = getPdfUrl(doc.pdf_url);
            
            return (
              <Card key={doc.id} className="border-border/60 flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{doc.title}</CardTitle>
                      {doc.description && (
                        <CardDescription className="line-clamp-2">
                          {doc.description}
                        </CardDescription>
                      )}
                    </div>
                    <FileText className="h-8 w-8 text-primary/60 flex-shrink-0 mt-1" />
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-3">
                  {pdfUrl && (
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setSelectedPdf(pdfUrl)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Prévisualiser
                      </Button>
                      <Button
                        variant="default"
                        className="w-full"
                        asChild
                      >
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Télécharger
                        </a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal de prévisualisation PDF */}
      {selectedPdf && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedPdf(null)}
        >
          <div
            className="relative w-full max-w-6xl h-full max-h-[90vh] bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setSelectedPdf(null)}
              >
                Fermer
              </Button>
            </div>
            <iframe
              src={`${selectedPdf}#toolbar=1`}
              className="w-full h-full border-0"
              title="Prévisualisation PDF"
            />
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default Documentation;

