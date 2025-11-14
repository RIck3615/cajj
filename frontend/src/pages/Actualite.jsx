import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeUp } from "@/lib/animations";
import api from "@/services/api";

const Actualite = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get("/news");
        console.log("Actualités chargées:", response.data);
        setNews(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des actualités:", error);
        console.error("Détails:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <motion.section
      className="container space-y-12 pb-16 pt-8 md:pt-12"
      {...fadeUp}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="space-y-3">
        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
          Actualité
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Les dernières nouvelles du CAJJ
        </h1>
        <p className="max-w-3xl text-muted-foreground">
          Restez informé·e des actions, plaidoyers et événements à venir.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-muted/40 p-10 text-center text-muted-foreground">
          Chargement des actualités...
        </div>
      ) : news.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-muted/40 p-10 text-center text-muted-foreground">
          Aucune actualité pour le moment.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <Card key={item.id} className="border-border/60">
              <CardHeader>
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <CardDescription>
                  {new Date(item.date).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {item.author && ` • ${item.author}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{item.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default Actualite;

