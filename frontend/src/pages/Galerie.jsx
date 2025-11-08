import { motion } from "framer-motion";
import { ArrowRight, Images, Video } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { galleryContent } from "@/data/staticContent";
import { fadeUp } from "@/lib/animations";

const Galerie = () => {
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
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Vidéos
              </CardTitle>
              <CardDescription>Capsules et témoignages illustrant nos actions.</CardDescription>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Bientôt
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {galleryContent.videos.map((item) => (
              <div key={item.id} className="space-y-2 rounded-xl border border-border/60 p-4">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <Button variant="outline" className="gap-2" asChild>
                  <a href={item.url}>
                    Regarder
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Images className="h-5 w-5 text-primary" />
                Photos
              </CardTitle>
              <CardDescription>
                Moments capturés lors de nos initiatives sur le terrain.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Bientôt
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {galleryContent.photos.map((item) => (
              <div key={item.id} className="space-y-2 rounded-xl border border-border/60 p-4">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <Button variant="outline" className="gap-2" asChild>
                  <a href={item.url}>
                    Voir
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
};

export default Galerie;

