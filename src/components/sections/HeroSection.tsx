import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Play, ArrowRight } from "lucide-react";

import heroImage from "@/assets/hero-children.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-x-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Children learning together"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent" />
      </div>

      {/* Decorative Elements */}
      <div className="hidden lg:block absolute top-20 right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse-soft" />
      <div className="hidden sm:block absolute bottom-20 -left-24 w-48 h-48 bg-accent/30 rounded-full blur-3xl animate-pulse-soft" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 pt-24">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight"
            >
              Empowering Every
              <span className="block text-primary">Vulnerable Child</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-lg md:text-xl text-primary-foreground/80 max-w-xl leading-relaxed"
            >
              Through education, life skills, and compassionate support, we're ensuring 
              no child is left behind in Rwanda's journey toward a brighter future.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link to="/donate">
                <button className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Donate Now
                </button>
              </Link>
              <Link to="/about">
                <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-gray-900 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
                  Our Story
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex flex-wrap gap-8 pt-8 border-t border-primary-foreground/20 mt-8"
            >
              {[
                { number: "75+", label: "Children Engaged Weekly" },
                { number: "40+", label: "Lives Transformed" },
                { number: "4", label: "Districts Served" },
              ].map((stat, index) => (
                <div key={index} className="text-center sm:text-left">
                  <div className="text-3xl md:text-4xl font-bold text-primary-foreground">
                    {stat.number}
                  </div>
                  <div className="text-sm text-primary-foreground/60">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

   
    </section>
  );
};
