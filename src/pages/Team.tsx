import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Heart, Mail, Phone, Users } from "lucide-react";
import { Link } from "react-router-dom";
import FOUNDERS_IMAGE_URL from "@/assets/images/Urakunzwe_Fouder-Profile.png";
import teamBgImage from "@/assets/images/Urakunzwe_Team.jpg";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
interface TeamMember {
  name         :string
  role         :string
  description  :string
  phone        :string
  email        :string
  socialsMedia :string
  profile      :string
}

const Team = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  useEffect(() => {
    const fetchTeam = async () => {
      const res = await api.get("/team/getAllMembers");
      setTeam(res.data);
    };
    fetchTeam();
  }, []);
  return (
    <Layout>
      {/* Hero */}
      <section 
        className="relative pt-32 pb-20 bg-cover bg-top bg-no-repeat overflow-x-hidden"
        style={{
          backgroundImage: `url(${teamBgImage})`,
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
              Our Team
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mt-4 mb-6 leading-tight">
              Meet the People Behind URAKUNZWE
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              A dedicated team of compassionate individuals working together to 
              transform the lives of vulnerable children in Rwanda.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">

          {   team.map((member) => (
  <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-3xl p-8 md:p-14 shadow-elevated border border-border"
            >
              <div className="flex flex-col md:flex-row gap-10 items-center">
                {/* Founder Image - Larger */}
                <div className="w-72 h-80 md:w-80 md:h-96 shrink-0 rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={member.profile}
                    alt="Heroine Umwari - Founder of URAKUNZWE"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Founder Info - Expanded */}
                <div className="text-center md:text-left flex-1">
                  <span className="text-primary font-semibold uppercase tracking-wider text-sm">
                    {member.role}
                  </span>
                  <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-2 mb-5">
                    {member.name}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                   {member.description}
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <a href={`tel:${member.phone}`}>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {member.phone}
                      </button>
                    </a>
                    <a href={`mailto:${member.email}`}>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          ))}
          
        </div>
      </section>

      {/* Join the Team */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              Join Our Mission
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              We're always looking for passionate individuals who share our vision of 
              empowering vulnerable children. Whether you want to volunteer, partner, or 
              support our work, we'd love to hear from you.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Get Involved
                </button>
              </Link>
              <Link to="/donate">
                <button className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Donate
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};
export default Team;