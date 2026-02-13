import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart } from "lucide-react";
import urakunzweLogo from "@/assets/Urakunzwe_logo.jpg";

const navLinks = [
  { name: "About", href: "/about" },
  { name: "Programs", href: "/programs" },
  { name: "Impact", href: "/impact" },
  { name: "Team", href: "/team" },
  { name: "News", href: "/news" },
  { name: "Contact", href: "/contact" },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // Logic: If scrolled more than 20px, set to true
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md py-2" // White background on scroll
          : "bg-transparent py-5"      // Transparent at top
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src={urakunzweLogo} 
            alt="Urakunzwe Logo" 
            className="w-16 h-16 object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`px-4 py-2 text-base font-medium transition-all duration-300 rounded-lg ${
                isScrolled 
                  ? (location.pathname === link.href ? "text-red-600" : "text-gray-600 hover:text-black hover:bg-gray-100") 
                  : (location.pathname === link.href ? "text-white bg-white/20" : "text-white hover:bg-white/10")
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden lg:block">
          <Link to="/donate">
            <button className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-lg hover:opacity-90 transform hover:scale-105 transition-all duration-300 shadow-md flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Donate Now
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`lg:hidden p-2 transition-colors ${isScrolled ? "text-gray-800" : "text-white"}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`block px-4 py-3 text-lg font-medium rounded-lg ${
                    location.pathname === link.href
                      ? "text-red-600 bg-red-50"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 pb-2">
                <Link to="/donate">
                  <button className="w-full py-3 bg-red-600 text-white font-bold rounded-lg flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5" />
                    Donate Now
                  </button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};