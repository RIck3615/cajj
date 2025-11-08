import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { aboutSections } from "@/data/staticContent";
import { fadeUp } from "@/lib/animations";

const About = () => {
  return (
    <motion.section
      className="container space-y-12 pb-16 pt-8 md:pt-12"
      {...fadeUp}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="space-y-3">
        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
          Nous connaître
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Comprendre l’ADN du Centre d’Aide Juridico Judiciaire
        </h1>
        <p className="max-w-3xl text-muted-foreground">
          Explorez l’identité, la vision et les valeurs qui guident le CAJJ dans la défense
          des droits humains et l’accès à la justice pour toutes et tous.
        </p>
      </div>

      <motion.figure
        className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <img
          src="/nous.jpg"
          alt="Équipe du Centre d’Aide Juridico Judiciaire CAJJ ASBL"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <figcaption className="px-6 py-4 text-sm text-muted-foreground">
          L’équipe du CAJJ réunie à Kolwezi, engagée pour la promotion et la protection des droits humains.
        </figcaption>
      </motion.figure>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {aboutSections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
          >
            <Card className="h-full border-border/60 bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">
                  {section.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {section.content}
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default About;

