import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import Hero from "@/components/public/Hero";
import WhyAaharika from "@/components/public/WhyAaharika";
import MenusSection from "@/components/public/MenusSection";
import CustomizeMenuSection from "@/components/public/CustomizeMenuSection";
import DishesSection from "@/components/public/DishesSection";
import WeOffer from "@/components/public/WeOffer";
import EventsSection from "@/components/public/EventsSection";
import TestimonialsSection from "@/components/public/TestimonialsSection";
import ContactSection from "@/components/public/ContactSection";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  name: "Aaharika",
  description:
    "Premium catering and complete event management in Kolkata — Bengali, Indo-Chinese and Mughlai cuisine for weddings, birthdays and corporate events.",
  servesCuisine: ["Bengali", "Indo-Chinese", "Mughlai"],
  areaServed: "Kolkata, West Bengal, India",
  slogan: "Flavours Made for Memories",
  email: "soumikmondal723@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kolkata",
    addressRegion: "West Bengal",
    addressCountry: "IN",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />
        <WhyAaharika />
        <MenusSection />
        <CustomizeMenuSection />
        <DishesSection />
        <WeOffer />
        <EventsSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
