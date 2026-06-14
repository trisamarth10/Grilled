import { BackgroundSystem } from "@/components/background/BackgroundSystem";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureSections } from "@/components/landing/FeatureSections";

export default function LandingPage() {
  return (
    <>
      <BackgroundSystem />
      <Navbar />
      <HeroSection />
      <FeatureSections />
    </>
  );
}
