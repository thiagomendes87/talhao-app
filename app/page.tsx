import Navbar from '@/components/Navbar'
import MapHero from '@/components/MapHero'
import Features from '@/components/Features'
import Pricing from '@/components/Pricing'
import WhatsAppTeaser from '@/components/WhatsAppTeaser'
import ForWho from '@/components/ForWho'
import FAQ from '@/components/FAQ'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <MapHero />
      <Features />
      <Pricing />
      <WhatsAppTeaser />
      <ForWho />
      <FAQ />
      <CTASection />
      <Footer />
    </main>
  )
}
