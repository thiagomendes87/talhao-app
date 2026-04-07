import Navbar from '@/components/Navbar'
import MapHero from '@/components/MapHero'
import Pricing from '@/components/Pricing'
import WhatsAppTeaser from '@/components/WhatsAppTeaser'
import ForWho from '@/components/ForWho'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <MapHero />
      <Pricing />
      <WhatsAppTeaser />
      <ForWho />
      <FAQ />
      <Footer />
    </main>
  )
}
