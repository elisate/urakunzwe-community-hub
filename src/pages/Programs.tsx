import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import {
  BookOpen,
  Mic2,
  Users,
  Brain,
  Heart,
  Lightbulb,
  Wallet,
  Shield,
  Calendar,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import programsBgImage from "@/assets/images/urakunzwe-education.jpg";
import { api } from "@/lib/api";
import { useState, useEffect } from "react";
interface Program {
  img: string;
  title: string;
  description: string;
}

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(programs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = programs.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await api.get("/program/getAllPrograms");
        setPrograms(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section
        className="relative pt-32 pb-20 bg-cover bg-center bg-no-repeat overflow-x-hidden"
        style={{
          backgroundImage: `url(${programsBgImage})`,
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
              Our Programs
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mt-4 mb-6 leading-tight">
              Transforming Lives Through Holistic Education
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              Our comprehensive programs address the multifaceted needs of vulnerable children,
              equipping them with skills for life, learning, and leadership.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Workshop Info */}
      <section className="py-12 bg-primary">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-primary-foreground">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6" />
              <span className="font-medium">Every Saturday</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6" />
              <span className="font-medium">1:00 PM – 5:00 PM CAT</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6" />
              <span className="font-medium">Kicukiro District, Nyakabanda Cell</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6" />
              <span className="font-medium">75+ Children Weekly</span>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 min-h-[400px]">
            {currentItems.map((program, index) => (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-2xl p-8 shadow-card border border-border hover:shadow-elevated transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <img src={program.img} alt={program.title} className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                  {program.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {program.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-border pt-10">
              <span className="text-sm text-muted-foreground font-medium">
                Showing {programs.length > 0 ? indexOfFirstItem + 1 : 0} - {Math.min(indexOfLastItem, programs.length)} of {programs.length} programs
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>
                <div className="flex items-center gap-2 px-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`h-10 w-10 rounded-xl text-sm font-bold transition-all ${currentPage === i + 1
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110"
                        : "hover:bg-muted text-muted-foreground"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-foreground" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Special Events */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              Special Celebrations
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-3">
              Community Events
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {["Easter Celebration", "International Children's Day", "Christmas Celebration"].map((event, index) => (
              <motion.div
                key={event}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 text-center shadow-card border border-border"
              >
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{event}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Programs;
