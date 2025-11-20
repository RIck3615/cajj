import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";

import { siteInfo } from "@/data/staticContent";

const Footer = () => {
  return (
    <footer className="border-t border-border/80 bg-primary py-10 text-primary-foreground">
      <div className="container flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-primary-foreground/70">
            CAJJ ASBL
          </p>
          <p className="text-lg font-semibold">Centre d'Aide Juridico Judiciaire</p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-primary-foreground/85">
          <a href="mailto:info@cajj-asbl.org" className="flex items-center justify-center gap-2 md:justify-start">
            <Mail className="h-5 w-5" />
            info@cajj-asbl.org
          </a>
          <a href="tel:+243991303434" className="flex items-center justify-center gap-2 md:justify-start">
            <Phone className="h-5 w-5" />
            +243 991 303 434
          </a>
        </div>
        <div className="flex flex-col items-center gap-1 text-xs text-primary-foreground/70 md:items-end">
          <p>&copy; {new Date().getFullYear()} Tous droits réservés.</p>
          <Link
            to="/admin/login"
            className="opacity-50 transition hover:opacity-100"
            title="Administration"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

