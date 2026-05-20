import LandingNavbar from '@/components/landing/LandingNavbar';
import Hero from '@/components/landing/Hero';
import SahyadriLegacy from '@/components/landing/SahyadriLegacy';
import TrekCards from '@/components/landing/TrekCards';
import HowItWorks from '@/components/landing/HowItWorks';
import LeadCapture from '@/components/landing/LeadCapture';
import MissionNote from '@/components/landing/MissionNote';
import WhyUs from '@/components/landing/WhyUs';
import OperatorConnect from '@/components/landing/OperatorConnect';
import LandingFooter from '@/components/landing/LandingFooter';
import FloatingWhatsApp from '@/components/landing/FloatingWhatsApp';

// Narrative arc:
// 1. Hero          — The mountains call
// 2. SahyadriLegacy — Historical context + live visitor counter
// 3. TrekCards     — Browse treks
// 4. HowItWorks    — Process clarity
// 5. LeadCapture   — Book your trek
// 6. MissionNote   — Why we built this + community ask
// 7. WhyUs         — Platform features
// 8. OperatorConnect — For operators
// 9. Footer

export default function LandingPage() {
  return (
    <main className="bg-[#0f1f17] text-[#f5f0e8] overflow-x-hidden">
      <LandingNavbar />
      <Hero />
      <SahyadriLegacy />
      <TrekCards />
      <HowItWorks />
      <LeadCapture />
      <MissionNote />
      <WhyUs />
      <OperatorConnect />
      <LandingFooter />
      <FloatingWhatsApp />
    </main>
  );
}
