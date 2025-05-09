import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import FeaturedProducts from "@/components/featured-products"
import InstagramSection from "@/components/instagram-section"
import ContactSection from "@/components/contact-section"

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <AboutSection />
      <FeaturedProducts />
      <InstagramSection />
      <ContactSection />
    </div>
  )
}
