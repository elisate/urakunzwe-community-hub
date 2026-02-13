import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Mic2, 
  Users, 
  Brain, 
  Heart, 
  Lightbulb, 
  Wallet, 
  Shield,
  ArrowRight
} from "lucide-react";


const programs = [
  {
    icon: BookOpen,
    title: "English Literacy",
    description: "Strengthening communication, academic performance, and overall confidence through language skills.",
    color: "bg-rose-light",
  },
  {
    icon: Mic2,
    title: "Public Speaking",
    description: "Supporting children to find and use their voices in positive and impactful ways.",
    color: "bg-secondary",
  },
  {
    icon: Users,
    title: "Leadership Skills",
    description: "Nurturing responsibility, teamwork, decision-making, and positive influence.",
    color: "bg-accent",
  },
  {
    icon: Brain,
    title: "Mental Health Support",
    description: "Promoting emotional wellbeing and resilience for all our beneficiaries.",
    color: "bg-rose-light",
  },
  {
    icon: Heart,
    title: "SRHR Education",
    description: "Building awareness, safety, and informed choices among teenage beneficiaries.",
    color: "bg-secondary",
  },
  {
    icon: Lightbulb,
    title: "Life Skills",
    description: "Preparing children for everyday challenges and adulthood with practical skills.",
    color: "bg-accent",
  },
  {
    icon: Wallet,
    title: "Financial Literacy",
    description: "Teaching saving, budgeting, and responsible money management.",
    color: "bg-rose-light",
  },
  {
    icon: Shield,
    title: "GBV Prevention",
    description: "Empowering children to protect themselves and others in schools and communities.",
    color: "bg-secondary",
  },
];

export const ProgramsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-gradient-warm overflow-x-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-primary font-semibold uppercase tracking-wider text-sm">
            Our Programs
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
            Transforming Lives Through Holistic Education
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Every Saturday from 1–5 PM, we host weekly workshops in Kicukiro District, 
            engaging 75+ children in programs that build skills for life.
          </p>
        </motion.div>

        {/* Programs Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program, index) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border border-border/50"
            >
              <div className={`w-14 h-14 ${program.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <program.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-3">
                {program.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {program.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link to="/programs">
            <button className="px-6 py-3 border border-primary/30 text-primary font-semibold rounded-lg hover:border-primary hover:bg-primary hover:text-primary-foreground transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
              View All Programs
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
