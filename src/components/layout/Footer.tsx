import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import urakunzweLogo from "@/assets/Urakunzwe_logo.jpg";

const quickLinks = [
  { name: "About Us", href: "/about" },
  { name: "Our Programs", href: "/programs" },
  { name: "Impact", href: "/impact" },
  { name: "Donate", href: "/donate" },
  { name: "Contact", href: "/contact" },
];

const programs = [
  "English Literacy",
  "Leadership Skills",
  "Mental Health Support",
  "Life Skills Development",
];

export const Footer = () => {
  return (
    <footer className="bg-charcoal text-primary-foreground overflow-x-hidden relative">

      {/* Wave SVG on top */}
      <div className="w-full" style={{ marginTop: "-2px" }}>
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="w-full"
          style={{ display: "block", height: "100px" }}
        >
          {/* Back wave - lighter */}
          <path
            d="M0,40 C180,80 360,0 540,50 C720,100 900,20 1080,60 C1260,100 1350,40 1440,50 L1440,120 L0,120 Z"
            fill="rgba(255,255,255,0.08)"
          />
          {/* Front wave - slightly more visible */}
          <path
            d="M0,70 C200,30 400,90 600,60 C800,30 1000,80 1200,55 C1320,42 1400,65 1440,60 L1440,120 L0,120 Z"
            fill="rgba(255,255,255,0.05)"
          />
        </svg>
      </div>

      {/* Giant background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span
          className="font-serif font-bold whitespace-nowrap select-none"
          style={{
            fontSize: "clamp(2rem, 5vw, 5rem)",
            color: "rgba(255,255,255,0.04)",
            letterSpacing: "0.02em",
          }}
        >
          Designed by Alain Niganze
        </span>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={urakunzweLogo}
                alt="Urakunzwe Logo"
                className="w-14 h-14 object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Empowering vulnerable children in Rwanda through education, life skills,
              and compassionate support since 2022.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6">Our Programs</h4>
            <ul className="space-y-3">
              {programs.map((program) => (
                <li key={program}>
                  <span className="text-sm text-primary-foreground/70">
                    {program}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-primary-foreground/70">
                  Kicukiro District, Niboye Sector, Nyakabanda Cell, Kigali, Rwanda
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a
                  href="tel:+250790458743"
                  className="text-sm text-primary-foreground/70 hover:text-primary transition-colors"
                >
                  +250 790 458 743
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a
                  href="mailto:urakunzweinitiative@gmail.com"
                  className="text-sm text-primary-foreground/70 hover:text-primary transition-colors"
                >
                  urakunzweinitiative@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} URAKUNZWE Initiative. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm text-primary-foreground/50 hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-primary-foreground/50 hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};