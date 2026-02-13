import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Mail, Phone } from "lucide-react";
import heroImage from "@/assets/hero-children.jpg";

const Terms = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/70 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Terms of Service
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Please read these terms carefully before using our website or services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto prose prose-lg"
          >
            <div className="bg-card rounded-2xl p-8 shadow-card border border-border space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing and using the URAKUNZWE Initiative website, you accept and agree to be bound by the terms 
                  and provision of this agreement.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Use of Website</h2>
                <p className="text-muted-foreground mb-4">
                  You may use our website for lawful purposes only. You agree not to use the website:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>In any way that violates any applicable law or regulation</li>
                  <li>To transmit or send unsolicited or unauthorized advertising</li>
                  <li>To impersonate or attempt to impersonate the organization</li>
                  <li>In any way that could damage or overburden the website</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Donations</h2>
                <p className="text-muted-foreground mb-4">
                  All donations made to URAKUNZWE Initiative are:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Voluntary and made without expectation of goods or services in return</li>
                  <li>Used exclusively for charitable purposes as outlined in our mission</li>
                  <li>Non-refundable unless required by law</li>
                  <li>Acknowledged with appropriate documentation for tax purposes where applicable</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Intellectual Property</h2>
                <p className="text-muted-foreground">
                  The content on this website, including text, graphics, logos, and images, is the property of 
                  URAKUNZWE Initiative and is protected by copyright and other intellectual property laws.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Disclaimer</h2>
                <p className="text-muted-foreground">
                  The information on this website is provided on an "as is" basis. URAKUNZWE Initiative makes no 
                  representations or warranties of any kind, express or implied, about the completeness, accuracy, 
                  reliability, or availability of the website or information.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  URAKUNZWE Initiative shall not be liable for any indirect, incidental, special, consequential, 
                  or punitive damages resulting from your use of the website.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify these terms at any time. Changes will be effective immediately 
                  upon posting on the website.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Contact Information</h2>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <a href="mailto:urakunzweinitiative@gmail.com" className="text-primary hover:underline">
                      urakunzweinitiative@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <a href="tel:+250790458743" className="text-primary hover:underline">
                      +250 790 458 743
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;