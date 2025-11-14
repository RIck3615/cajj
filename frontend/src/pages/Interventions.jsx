import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeUp } from "@/lib/animations";
import api from "@/services/api";

const Interventions = () => {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        const response = await api.get("/actions");
        console.log("Actions chargées:", response.data);
        setActions(response.data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des actions:", error);
        console.error("Détails:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActions();
  }, []);

  return (
    <motion.section
      className="container space-y-12 pb-16 pt-8 md:pt-12"
      {...fadeUp}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="space-y-3">
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          Domaine d’intervention
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Nos actions pour défendre les droits humains
        </h1>
        <p className="max-w-3xl text-muted-foreground">
          Une présence constante sur le terrain pour accompagner, former et sensibiliser les
          communautés les plus vulnérables face aux enjeux liés à l’exploitation des ressources naturelles.
        </p>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground py-8">Chargement...</div>
      ) : actions.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">Aucune action disponible.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {actions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Card className="h-full bg-brand text-brand-foreground shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    {action.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-brand-foreground/90 whitespace-pre-line">
                    {action.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default Interventions;

