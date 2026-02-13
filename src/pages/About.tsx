import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Target, Eye, Heart, Shield, Lightbulb, Users, Star, Award } from "lucide-react";
import teachingImage from "@/assets/images/Urakunzwe-problem.jpg";
import communityImage from "@/assets/images/urakunzwe-community-activity.jpg";
import aboutBgImage from "@/assets/images/Urakunzwe_about.jpg";

const values = [
  { icon: Heart, name: "Love & Compassion", description: "We approach every child with unconditional love." },
  { icon: Shield, name: "Child Dignity & Protection", description: "Safeguarding children's rights and wellbeing." },
  { icon: Lightbulb, name: "Integrity & Transparency", description: "Honest in all our actions and reporting." },
  { icon: Users, name: "Community Responsibility", description: "Working together with families and communities." },
  { icon: Star, name: "Hope & Empowerment", description: "Building confidence and future possibilities." },
  { icon: Award, name: "Equity in Education", description: "Equal opportunities for every child." },
];

const About = () => {
  return (
    <Layout>
      <section 
        className="relative pt-32 pb-20 bg-cover bg-top bg-no-repeat overflow-x-hidden"
        style={{
          backgroundImage: `url(${aboutBgImage})`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/70 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              About Us
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mt-4 mb-6 leading-tight">
              Walking Alongside Rwanda's Children
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              Founded in 2022 by Heroine Umwari, URAKUNZWE Initiative is a community-driven 
              organization dedicated to empowering vulnerable children through education, 
              life skills, and compassionate support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={teachingImage}
                alt="Teaching moment"
                className="rounded-2xl shadow-elevated w-full"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                The Problem We Address
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                In Rwanda, about 27.4% of the population still lives in poverty, and children 
                remain disproportionately affected by deprivations in health, education, housing, 
                and essential services.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Approximately 11.9% of children aged 5–14 and 26.8% of those aged 15–17 live 
                in multidimensional poverty. Many children do not achieve adequate learning 
                outcomes, and foundational skills such as English proficiency are weak nationwide.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Within this context, children in vulnerable households who lack basic needs, 
                face school dropout risks, and struggle with English literacy are at an even 
                greater disadvantage—making targeted support urgent and essential.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-2xl p-8 shadow-card border border-border"
            >
              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To identify, support, and empower vulnerable and illiterate young Rwandan children 
                through direct community engagement. We address immediate needs such as food, health 
                access, and education, while equipping children with English literacy, leadership, 
                public speaking, life skills, financial literacy, and psychosocial support.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card rounded-2xl p-8 shadow-card border border-border"
            >
              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To ensure that every vulnerable child has access to quality education, life and 
                leadership skills, and safe, supportive environments—so no child is left behind. 
                We contribute to resilient, inclusive communities in alignment with the UN 
                Sustainable Development Goals: quality education (SDG 4), gender equality (SDG 5), 
                and reduced inequalities (SDG 10).
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              What We Stand For
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-3">
              Our Core Values
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-elevated transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{value.name}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-20 bg-gradient-warm">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <span className="text-primary font-semibold uppercase tracking-wider text-sm">
                Meet Our Founder
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                Heroine Umwari
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                With a deep passion for child welfare and community development, Heroine Umwari 
                founded URAKUNZWE Initiative in December 2022. Her vision was simple yet powerful: 
                to ensure no vulnerable child in Rwanda is left behind.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Through door-to-door family visits and weekly community workshops, she has built 
                a movement that has already transformed the lives of over 40 children across 
                Kigali and beyond.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <img
                src={communityImage}
                alt="Community activity"
                className="rounded-2xl shadow-elevated w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
