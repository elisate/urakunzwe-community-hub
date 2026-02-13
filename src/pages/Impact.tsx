import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { ImpactSection } from "@/components/sections/ImpactSection";
import { CheckCircle, Heart, Quote } from "lucide-react";
import impactBgImage from "@/assets/images/urakunzwe-impact.jpg";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";


interface SuccessStory {
  id?: string;
  title: string;
  description: string;
}
interface KeyAchievement {
  id?: string;
  description: string;
}


const dummyStories: SuccessStory[] = [
  {
    title: "Back to School",
    description: "Children who had dropped out of school successfully returned to education, thanks to our support with school materials and health insurance enrollment.",
  },
  {
    title: "Finding Their Voice",
    description: "Increased confidence and leadership among participants has led many children to become peer mentors and advocates in their communities.",
  },
  {
    title: "Emotional Healing",
    description: "Improved emotional wellbeing and awareness of rights has helped children process trauma and build resilience for the future.",
  },
  {
    title: "Family Stability",
    description: "Parents received guidance on financial literacy, helping them start small businesses and provide better stability for their children.",
  },
  {
    title: "Community Unity",
    description: "Our weekly gatherings have fostered a strong sense of community, reducing isolation and building lasting support networks.",
  },
  {
    title: "Health & Nutrition",
    description: "Regular nutritional support and health check-ups have significantly improved the physical well-being of over 50 children.",
  }
];


const Impact = () => {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [achievements, setAchievements] = useState<KeyAchievement[]>([]);

  const itemsPerPage = 3;

  useEffect(() => {
    const fetchSuccessStories = async () => {
      try {
        const response = await api.get("/success_story/getAllStories");
        if (response.data && response.data.length > 0) {
          setStories(response.data);
        } else {
          setStories(dummyStories);
        }
      } catch (error) {
        console.error("Error fetching success stories:", error);
        setStories(dummyStories);
      }
    };
    fetchSuccessStories();
  }, []);

  useEffect(() => { // Changed ( to {
    const fetchAchievements = async () => {
      try {
        const response = await api.get("/achievement/getAllAchievements");
        setAchievements(response.data);
      } catch (error) {
        console.error("Error fetching key achievements:", error);
      } // Added missing closing brace for catch
    };

    fetchAchievements();
  }, []); // Closed the useEffect body properly

  const totalPages = Math.ceil(stories.length / itemsPerPage);
  const currentStories = stories.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <Layout>
      {/* Hero */}
      <section
        className="relative h-screen flex items-center bg-cover bg-top bg-no-repeat overflow-x-hidden"
        style={{
          backgroundImage: `url(${impactBgImage})`,
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
              Our Impact
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mt-4 mb-6 leading-tight">
              Measuring Our Progress
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              Since December 2022, we've been working tirelessly to transform lives.
              Here's the impact we've made together with our supporters and community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Reuse component */}
      <ImpactSection />

      {/* Key Achievements */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              What We've Accomplished
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-3">
              Key Achievements
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 bg-card rounded-xl p-5 shadow-card border border-border"
                >
                  <CheckCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                  <p className="text-foreground">{achievement.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Grid with Pagination */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              Real Stories
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-3">
              Success Stories
            </h2>
          </motion.div>

          {/* Grid Layout with Horizontal Slide */}
          <div className="relative overflow-hidden min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="grid md:grid-cols-3 gap-8 mb-12"
              >
                {currentStories.map((story) => (
                  <div
                    key={story.title}
                    className="bg-card rounded-2xl p-8 shadow-card border border-border h-full flex flex-col"
                  >
                    <Quote className="w-10 h-10 text-primary/30 mb-4" />
                    <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                      {story.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed flex-grow">
                      {story.description}
                    </p>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`h-3 transition-all duration-300 rounded-full ${currentPage === index
                    ? "w-8 bg-primary"
                    : "w-3 bg-primary/20 hover:bg-primary/40"
                    }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SDG Alignment */}
      <section className="py-20 bg-gradient-warm">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              Global Alignment
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-3 mb-8">
              Contributing to the UN Sustainable Development Goals
            </h2>

            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { number: 4, title: "Quality Education" },
                { number: 5, title: "Gender Equality" },
                { number: 10, title: "Reduced Inequalities" },
              ].map((sdg, index) => (
                <motion.div
                  key={sdg.number}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-6 shadow-card border border-border"
                >
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-foreground">
                      {sdg.number}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground">SDG {sdg.number}</h3>
                  <p className="text-sm text-muted-foreground">{sdg.title}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Impact;
