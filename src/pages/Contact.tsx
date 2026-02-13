import { Layout } from "@/components/layout/Layout";
import { ContactSection } from "@/components/sections/ContactSection";
import { motion } from "framer-motion";
import contactBgImage from "@/assets/images/urakunzwe-community-activity.jpg";

const Contact = () => {
  return (
    <Layout>
      {/* Hero */}
      <section 
        className="relative h-screen flex items-center bg-cover bg-top bg-no-repeat overflow-x-hidden"
        style={{
          backgroundImage: `url(${contactBgImage})`,
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
              Contact Us
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mt-4 mb-6 leading-tight">
              Get in Touch
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              Have questions? Want to partner with us? We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <ContactSection />

      {/* Map Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl overflow-hidden shadow-elevated h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15949.97714669!2d30.0619!3d-1.9740!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca6f07c5e1f0d%3A0x8!2sKicukiro%2C%20Kigali%2C%20Rwanda!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="URAKUNZWE Initiative Location"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
