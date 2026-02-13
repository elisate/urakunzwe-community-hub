import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Heart, CreditCard, Smartphone, Building2, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const donationImpact = [
  { amount: "$10", impact: "Provides school supplies for one child for a month" },
  { amount: "$25", impact: "Covers health insurance enrollment for one child" },
  { amount: "$50", impact: "Sponsors a child's weekly workshop participation for 3 months" },
  { amount: "$100", impact: "Supports food and essentials for a vulnerable family" },
];

const paymentMethods = [
  { 
    icon: Smartphone, 
    name: "Mobile Money", 
    details: "MTN Mobile Money / Airtel Money",
    instructions: "Send to: +250 790 458 743"
  },
  { 
    icon: Building2, 
    name: "Bank Transfer", 
    details: "Direct bank deposit",
    instructions: "Contact us for bank details"
  },
  { 
    icon: CreditCard, 
    name: "Card Payment", 
    details: "Mastercard / Visa",
    instructions: "Contact us to arrange payment"
  },
];

const Donate = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Heart className="w-10 h-10 text-primary-foreground fill-current" />
            </motion.div>
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              Support Our Mission
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mt-4 mb-6 leading-tight">
              Your Donation Changes Lives
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              Every contribution, no matter the size, helps us provide education, 
              essential supplies, and hope to vulnerable children in Rwanda.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              Your Impact
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-3">
              See How Your Donation Helps
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {donationImpact.map((item, index) => (
              <motion.div
                key={item.amount}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-card border border-border text-center hover:shadow-elevated transition-shadow duration-300"
              >
                <div className="text-4xl font-bold text-primary mb-4">{item.amount}</div>
                <p className="text-muted-foreground text-sm">{item.impact}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              How to Donate
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-3">
              Choose Your Payment Method
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {paymentMethods.map((method, index) => (
              <motion.div
                key={method.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-8 shadow-card border border-border text-center"
              >
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <method.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl text-foreground mb-2">{method.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{method.details}</p>
                <p className="text-primary font-medium text-sm">{method.instructions}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Monthly Giving */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-primary rounded-3xl p-8 md:p-12 text-center"
            >
              <Heart className="w-12 h-12 text-primary-foreground mx-auto mb-6" />
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Become a Monthly Sponsor
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
                Join our community of monthly sponsors and provide consistent, 
                life-changing support to vulnerable children year-round.
              </p>
              <Link to="/contact">
                <button className="px-8 py-4 bg-white border-2 border-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-200 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                  Contact Us to Become a Sponsor
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust & Transparency */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="font-serif text-3xl font-bold text-foreground mb-8">
              Our Commitment to You
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                "100% of donations go directly to children",
                "Monthly financial reports available",
                "Regular updates on your impact",
              ].map((commitment, index) => (
                <div key={index} className="flex items-center gap-3 justify-center">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-foreground text-sm">{commitment}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Donate;
