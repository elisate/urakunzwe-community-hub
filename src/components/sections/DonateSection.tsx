import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Heart, CreditCard, Smartphone, Building2, ArrowRight } from "lucide-react";


const donationOptions = [
  { icon: Smartphone, name: "Mobile Money", description: "Quick & easy MTN/Airtel" },
  { icon: Building2, name: "Bank Transfer", description: "Direct bank deposit" },
  { icon: CreditCard, name: "Card Payment", description: "Mastercard/Visa" },
];

export const DonateSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 overflow-x-hidden bg-gradient-to-br from-gray-50 to-white">
      {/* Background */}
      <div className="hidden lg:block absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="hidden lg:block absolute bottom-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto shadow-elevated"
            >
              <Heart className="w-10 h-10 text-primary-foreground fill-current animate-pulse-soft" />
            </motion.div>

            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Your Support Changes Lives
            </h2>

            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Every contribution helps us provide education, essential supplies, and hope 
              to vulnerable children in Rwanda. Together, we can ensure no child is left behind.
            </p>

            {/* Donation Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid sm:grid-cols-3 gap-4 pt-8"
            >
              {donationOptions.map((option, index) => (
                <div
                  key={option.name}
                  className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-5 text-center hover:bg-white transition-colors duration-300 shadow-sm"
                >
                  <option.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900">{option.name}</h4>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            >
              <Link to="/donate">
                <button className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5" />
                  Donate Now
                </button>
              </Link>
              <Link to="/contact">
                <button className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-primary/30 text-primary font-semibold rounded-xl hover:border-primary hover:text-primary transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                  Become a Partner
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </motion.div>

            {/* Trust Badge */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
              className="text-sm text-gray-500 pt-6"
            >
              ✓ Transparent financial reporting &nbsp;•&nbsp; ✓ 100% goes to children &nbsp;•&nbsp; ✓ Monthly updates
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
