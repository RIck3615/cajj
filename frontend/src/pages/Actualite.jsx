import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { fadeUp } from "@/lib/animations";

const Actualite = () => {
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

      <div className="rounded-2xl border border-dashed border-border/80 bg-muted/40 p-10 text-center text-muted-foreground">
        Les actualités seront bientôt disponibles.
      </div>
    </motion.section>
  );
};

export default Actualite;

