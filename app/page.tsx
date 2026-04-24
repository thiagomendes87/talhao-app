import Navbar from '@/components/Navbar'
import MapHero from '@/components/MapHero'
import TrustStrip from '@/components/TrustStrip'
import StatsBar from '@/components/StatsBar'
import HowItWorks from '@/components/HowItWorks'
import OutputFormats from '@/components/OutputFormats'
import ForWho from '@/components/ForWho'
import Pricing from '@/components/Pricing'
import CoverageHeatmap from '@/components/CoverageHeatmap'
import FAQ from '@/components/FAQ'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="bg-white">
      <Navbar />
      <MapHero />
      <TrustStrip />
      <StatsBar />
      <HowItWorks />
      <OutputFormats />
      <ForWho />
      <Pricing />
      <CoverageHeatmap />
      <FAQ />
      <CTASection />
      <Footer />
    </main>
  )
}
