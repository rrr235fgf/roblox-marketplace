import { LandingHero } from "@/components/landing-hero"
import { FeaturedAssets } from "@/components/featured-assets"
import { Categories } from "@/components/categories"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Testimonials } from "@/components/testimonials"
import { HowItWorks } from "@/components/how-it-works"
import { Newsletter } from "@/components/newsletter"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <LandingHero />
        <HowItWorks />
        <FeaturedAssets />
        <Categories />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
