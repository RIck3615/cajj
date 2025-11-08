import { cn } from "@/lib/utils";

const Logo = ({ className, ...props }) => (
  <img
    src="/logo.png"
    alt="Centre d’Aide Juridico Judiciaire CAJJ ASBL"
    className={cn("h-12 w-auto", className)}
    loading="lazy"
    {...props}
  />
);

export default Logo;

