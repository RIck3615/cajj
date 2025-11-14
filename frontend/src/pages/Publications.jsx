import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeUp } from "@/lib/animations";
import api from "@/services/api";

const Publications = () => {
  const [publications, setPublications] = useState({ cajj: [], partners: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await api.get("/publications");
        console.log("Publications chargées:", response.data);
        setPublications(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des publications:", error);
        console.error("Détails:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  return (
    <motion.section
      className="container space-y-12 pb-16 pt-8 md:pt-12"
      {...fadeUp}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="space-y-3">
        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
          Publications
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Ressources du CAJJ et de nos partenaires
        </h1>
        <p className="max-w-3xl text-muted-foreground">
          Retrouvez nos rapports, études et documents élaborés conjointement avec notre réseau de partenaires engagés.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              CAJJ
            </CardTitle>
            <CardDescription>
              Publications internes du CAJJ mettant en lumière nos initiatives et nos résultats.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <p className="text-center text-muted-foreground">Chargement...</p>
            ) : publications.cajj.length === 0 ? (
              <p className="text-center text-muted-foreground">Aucune publication CAJJ pour le moment.</p>
            ) : (
              publications.cajj.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-lg border border-border/60 bg-background/80 p-4 transition hover:border-primary/40 hover:shadow-card"
                >
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  )}
                  {item.url && item.url !== "#" && (
                    <Button variant="link" className="p-0" asChild>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="gap-1 text-primary">
                        Voir la publication
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              Nos partenaires
            </CardTitle>
            <CardDescription>
              Une sélection des ressources produites par nos organisations alliées.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <p className="text-center text-muted-foreground">Chargement...</p>
            ) : publications.partners.length === 0 ? (
              <p className="text-center text-muted-foreground">Aucun partenaire pour le moment.</p>
            ) : (
              publications.partners.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-lg border border-border/60 bg-background/80 p-4 transition hover:border-primary/40 hover:shadow-card"
                >
                  <h3 className="text-lg font-semibold">{item.name || item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  )}
                  {item.url && item.url !== "#" && (
                    <Button variant="link" className="p-0" asChild>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="gap-1 text-primary">
                        Découvrir
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
};

export default Publications;

