
import LandingHeader from "@/components/landing/LandingHeader";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingSection from "@/components/landing/PricingSection";
import CtaSection from "@/components/landing/CtaSection";
import LandingFooter from "@/components/landing/LandingFooter";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <CtaSection />
      <LandingFooter />
    </div>
  );
};

export default Landing;
