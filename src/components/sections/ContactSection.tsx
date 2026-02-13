import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";

interface ContactFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}
export const ContactSection = () => {

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormInputs>();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);

      const { firstName, lastName, email, message, subject } = data;

      const formData = {
        firstName,
        lastName,
        email,
        message,
        subject,
      };
      // Simulate form submission
      const res = await api.post("/contact/createContact", formData);
      console.log(res.data);
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
      reset();

    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={ref} className="py-24 bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <span className="text-primary font-semibold uppercase tracking-wider text-sm">
                Get in Touch
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6 leading-tight">
                Let's Create Change Together
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Whether you want to donate, partner, volunteer, or simply learn more about
                our work, we'd love to hear from you.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Location</h4>
                  <p className="text-muted-foreground">
                    Kicukiro District, Niboye Sector, Nyakabanda Cell<br />
                    Kigali, Rwanda
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Phone / WhatsApp</h4>
                  <a href="tel:+250790458743" className="text-primary hover:underline">
                    +250 790 458 743
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Email</h4>
                  <a href="mailto:urakunzweinitiative@gmail.com" className="text-primary hover:underline">
                    urakunzweinitiative@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Weekly Workshops</h4>
                  <p className="text-muted-foreground">
                    Every Saturday, 1:00 PM – 5:00 PM CAT
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-card rounded-2xl p-8 shadow-elevated border border-border space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">First Name</label>
                  <Input
                    placeholder="John"
                    className="h-12"
                    {...register("firstName", { required: "First name is required" })}
                  />
                  {errors.firstName && <p className="text-red-500">{errors?.firstName?.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Last Name</label>
                  <Input
                    placeholder="Doe"

                    className="h-12"
                    {...register("lastName", { required: "Last name is required" })}
                  />
                  {errors.lastName && <p className="text-red-500">{errors.lastName?.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input
                  type="email"
                  placeholder="john@example.com"

                  className="h-12"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && <p className="text-red-500">{errors.email?.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Subject</label>
                <Input
                  placeholder="How can we help?"

                  className="h-12"
                  {...register("subject", { required: "Subject is required" })}
                />
                {errors.subject && <p className="text-red-500">{errors.subject?.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Message</label>
                <Textarea
                  placeholder="Tell us about your interest in URAKUNZWE Initiative..."
                  rows={5}
                  className="resize-none"
                  {...register("message", { required: "Message is required" })}
                />
                {errors.message && <p className="text-red-500">{errors.message?.message}</p>}
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
