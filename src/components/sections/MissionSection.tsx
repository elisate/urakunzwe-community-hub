import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Eye, Heart, Shield, Lightbulb, Users } from "lucide-react";
import teachingImage from "@/assets/images/urakunzwe-education.jpg";

const values = [
  { icon: Heart, name: "Love & Compassion" },
  { icon: Shield, name: "Child Protection" },
  { icon: Lightbulb, name: "Integrity" },
  { icon: Users, name: "Community" },
];

export const MissionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-background overflow-x-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-elevated">
              <img
                src={teachingImage}
                alt="Children learning and growing together"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
            </div>
            
            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute -bottom-4 -right-4 lg:-bottom-8 lg:-right-8 bg-card p-6 rounded-2xl shadow-elevated border border-border max-w-xs"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center">
                  <Heart className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">Since 2022</div>
                  <div className="text-sm text-muted-foreground">Serving with love</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <span className="text-primary font-semibold uppercase tracking-wider text-sm">
                Who We Are
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 leading-tight">
                Walking Alongside Rwanda's Most Vulnerable Children
              </h2>
            </div>

            {/* Mission */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">Our Mission</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To identify, support, and empower vulnerable and illiterate young Rwandan 
                    children through direct community engagement, addressing immediate needs 
                    while equipping children with essential life skills.
                  </p>
                </div>
              </div>
            </div>

            {/* Vision */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Every vulnerable child has access to quality education, life and leadership 
                    skills, and safe, supportive environments—so no child is left behind.
                  </p>
                </div>
              </div>
            </div>

            {/* Values */}
            <div className="pt-4">
              <h3 className="font-semibold text-foreground mb-4">Our Core Values</h3>
              <div className="flex flex-wrap gap-3">
                {values.map((value, index) => (
                  <motion.div
                    key={value.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full"
                  >
                    <value.icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-secondary-foreground">
                      {value.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
