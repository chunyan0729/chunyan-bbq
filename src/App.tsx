import { AppProvider } from '@/context'
import Navbar from '@/components/Navbar'
import ScrollVideoHero from '@/components/ScrollVideoHero'
import MenuSection from '@/components/MenuSection'
import CraftSection from '@/components/CraftSection'
import GallerySection from '@/components/GallerySection'
import EventsSection from '@/components/EventsSection'
import ReviewsSection from '@/components/ReviewsSection'
import BlogSection from '@/components/BlogSection'
import ReserveSection from '@/components/ReserveSection'
import ClosingSection from '@/components/ClosingSection'
import MosaicGlow from '@/components/MosaicGlow'

export default function App() {
  return (
    <AppProvider>
      <div id="top" className="bg-[#0B0604]">
        <Navbar />
        <MosaicGlow />
        <ScrollVideoHero />
        <MenuSection />
        <CraftSection />
        <GallerySection />
        <EventsSection />
        <ReviewsSection />
        <BlogSection />
        <ReserveSection />
        <ClosingSection />
      </div>
    </AppProvider>
  )
}
