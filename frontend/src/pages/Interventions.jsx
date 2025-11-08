import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { actions } from "@/data/staticContent";
import { fadeUp } from "@/lib/animations";

const Interventions = () => {
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
                <p className="text-base text-brand-foreground/90">
                  {action.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default Interventions;

