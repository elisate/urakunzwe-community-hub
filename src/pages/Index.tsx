import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/sections/HeroSection";
import { MissionSection } from "@/components/sections/MissionSection";
import { ProgramsSection } from "@/components/sections/ProgramsSection";
import { ImpactSection } from "@/components/sections/ImpactSection";
import { DonateSection } from "@/components/sections/DonateSection";
import { ContactSection } from "@/components/sections/ContactSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <MissionSection />
      <ProgramsSection />
      <ImpactSection />
      <DonateSection />
      <ContactSection />
    </Layout>
  );
};

export default Index;
