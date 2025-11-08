import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteInfo, aboutSections } from "@/data/staticContent";
import { fadeIn } from "@/lib/animations";

const highlightedSections = [
  {
    title: "Qui sommes-nous ?",
    description:
      "Une équipe de juristes et d’avocats volontaires basée à Kolwezi, engagée pour les droits humains et l’environnement.",
    to: "/nous-connaitre",
  },
  {
    title: "Nos actions",
    description:
      "Assistance juridique, plaidoyer et formations dédiées aux communautés impactées par l’exploitation des ressources naturelles.",
    to: "/domaine",
  },
  {
    title: "Nos publications",
    description:
      "Rapports, études et ressources produites avec nos partenaires pour documenter et transformer le terrain.",
    to: "/publications",
  },
];

const Home = () => {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-hero-gradient pb-24 pt-32 text-white">
        <div className="absolute inset-0 bg-slate-900/50 mix-blend-multiply" />
        <motion.div
          className="container relative grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)] lg:items-center"
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="space-y-6">
            <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
              {siteInfo.tagline}
            </Badge>
            <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
              {siteInfo.name}
            </h1>
            <p className="text-lg text-slate-100 md:text-xl">
              {siteInfo.subTagline}
            </p>
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link to="/nous-connaitre" className="gap-2">
                Découvrir le CAJJ
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="hidden rounded-2xl border border-white/30 bg-white/10 p-6 backdrop-blur md:block">
            <h2 className="text-lg font-semibold text-white">
              Valeurs qui nous animent
            </h2>
            <ul className="mt-4 grid gap-3 text-sm text-slate-100/90">
              {aboutSections
                .filter((section) => section.id === "valeurs")
                .map((section) => (
                  <li key={section.id} className="leading-relaxed">
                    {section.content}
                  </li>
                ))}
            </ul>
          </div>
        </motion.div>
      </section>

      <section className="container space-y-10 py-16">
        <div className="space-y-3 text-center md:text-left">
          <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
            Ensemble pour les droits humains
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Agir localement pour un impact durable
          </h2>
          <p className="mx-auto max-w-3xl text-muted-foreground md:mx-0">
            Le Centre d’Aide Juridico Judiciaire (CAJJ ASBL) accompagne les communautés
            affectées par l’exploitation des ressources naturelles, en veillant à l’application
            des normes juridiques nationales et des instruments internationaux ratifiés par la RD Congo.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {highlightedSections.map((section) => (
            <Card
              key={section.title}
              className="group flex h-full flex-col border-border/70 bg-card/90 backdrop-blur transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-card"
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4 text-sm text-muted-foreground">
                <p>{section.description}</p>
                <Button variant="link" asChild className="mt-auto px-0 text-primary">
                  <Link to={section.to} className="gap-1">
                    En savoir plus
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;

