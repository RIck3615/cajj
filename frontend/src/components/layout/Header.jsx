import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteInfo } from "@/data/staticContent";
import Logo from "@/components/branding/Logo";

const navItems = [
  { to: "/", label: "Accueil" },
  { to: "/nous-connaitre", label: "Nous connaître" },
  { to: "/domaine", label: "Domaine d’intervention" },
  { to: "/publications", label: "Publications" },
  { to: "/actualite", label: "Actualité" },
  { to: "/galerie", label: "Galerie" },
];

const Header = () => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-white/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-3"
        >
          <Logo className="h-12 w-auto" />
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              CAJJ ASBL
            </span>
            <span className="text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">
              Centre d'Aide Juridico Judiciaire
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-brand/10 hover:text-brand",
                  isActive && "bg-brand text-brand-foreground shadow-lg"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={toggleMenu}
          className="inline-flex items-center justify-center rounded-full border border-border/70 p-2 text-slate-700 transition hover:border-brand/60 hover:text-brand md:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border/60 bg-white md:hidden">
          <nav className="container flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-brand/10 hover:text-brand",
                    isActive && "bg-brand text-brand-foreground"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
};

export default Header;

