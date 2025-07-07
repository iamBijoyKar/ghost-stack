import { Logo } from "./logo";
import { Twitter, Linkedin, Github, Facebook, Instagram } from "lucide-react";
import Link from "next/link";
import { Separator } from "./ui/separator";

const footerLinks = [
  { label: "Products", href: "#" },
  { label: "Studio", href: "#" },
  { label: "Clients", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
];

const socialLinks = [
  { icon: <Twitter />, href: "https://twitter.com" },
  { icon: <Linkedin />, href: "https://linkedin.com" },
  { icon: <Github />, href: "https://github.com" },
  { icon: <Facebook />, href: "https://facebook.com" },
  { icon: <Instagram />, href: "https://instagram.com" },
];

export default function Footer() {
  return (
    <footer className="bg-accent text-foreground w-full p-6 pt-12">
      <div className="flex w-full flex-col items-center">
        <div className="my-4 flex items-center gap-2">
          <Logo />
        </div>
        <nav className="my-6 flex flex-wrap justify-center gap-6 text-sm">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-muted-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <Separator className="my-6" />
      <div className="mt-6 flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <div className="text-sm text-gray-400">© GhostStack 2025</div>
        <div className="text-secondary flex gap-4 text-xl">
          {socialLinks.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              {link.icon}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
