import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import newsBgImage from "@/assets/images/urakuzwe-story.jpg";
import { api } from "@/lib/api";
import { useState, useEffect } from "react";

interface NewsImage {
  id: string;
  url: string; // or 'path', depending on your NewsImage model
}

interface NewsItem {
  id: string
  title: String
  content: String
  category: String
  images: NewsImage[]
  createdAt: string
  updatedAt: string

}


const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(news.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = news.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const fetchNews = async () => {
      const res = await api.get("/news/getAllNews");
      setNews(res.data);
    };
    fetchNews();
  }, []);
  return (
    <Layout>
      {/* Hero */}
      <section
        className="relative h-screen flex items-center bg-cover bg-top bg-no-repeat overflow-x-hidden"
        style={{
          backgroundImage: `url(${newsBgImage})`,
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
              News & Updates
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mt-4 mb-6 leading-tight">
              Stay Connected
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              Get the latest news, updates, and stories from URAKUNZWE Initiative.
              See how your support is making a difference.
            </p>
          </motion.div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[600px]">
            {currentItems.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl overflow-hidden shadow-card border border-border group hover:shadow-elevated transition-shadow duration-300"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.images[0]?.url}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-semibold text-primary bg-secondary px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {item.content}
                  </p>
                  <button className="p-0 h-auto text-primary">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2 inline-block" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-border pt-10">
              <span className="text-sm text-muted-foreground font-medium">
                Showing {news.length > 0 ? indexOfFirstItem + 1 : 0} - {Math.min(indexOfLastItem, news.length)} of {news.length} articles
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

      {/* Subscribe Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto text-center"
          >
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              Stay Updated
            </h2>
            <p className="text-muted-foreground mb-8">
              Follow us on social media for the latest news and updates from
              URAKUNZWE Initiative.
            </p>
            <Link to="/contact">
              <button className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                Contact Us
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default News;
