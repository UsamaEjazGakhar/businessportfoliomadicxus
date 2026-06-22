export const revalidate = 0;

import Hero from "@/components/main/hero";
import Stats from "@/components/main/stats";
import Divisions from "@/components/main/divisions";
import AboutBand from "@/components/main/about-band";
import Navbar from "@/components/main/navbar";
import Team from "@/components/main/team";

import ITServices from "@/components/main/it-services";
import TrustSection from "@/components/main/trust-section";
import CtaSection from "@/components/main/cta-section";
import Footer from "@/components/main/footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <Divisions />
      <AboutBand />
      <Team />
      <ITServices />
      <TrustSection />
      <CtaSection />
      <Footer />
    </>
  );
}
