export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[92vh] items-center overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1920&q=75"
          alt="Elegant Indian catering spread for a celebration"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/70 to-charcoal/40" />
      </div>

      <div className="container-x relative z-10 pt-24">
        <div className="max-w-2xl animate-fadeInUp">
          <span className="inline-block rounded-full bg-gold/20 px-4 py-1.5 text-sm font-medium text-gold-light ring-1 ring-gold/40">
            Catering • Decoration • Event Management
          </span>
          <h1 className="mt-5 font-serif text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
            Aaharika
          </h1>
          <p className="mt-2 font-serif text-2xl text-gold sm:text-3xl">
            Flavours Made for Memories
          </p>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/85">
            Authentic flavours, beautiful presentations and seamless event management for
            celebrations that become unforgettable memories — proudly serving Kolkata and
            surrounding areas.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#menus" className="btn-gold">Explore Menus</a>
            <a href="#contact" className="btn-primary">Book Your Event</a>
            <a href="#customize" className="btn-outline border-white text-white hover:bg-white hover:text-brand">
              Customize Your Menu
            </a>
            <a href="#contact" className="btn-ghost text-white hover:bg-white/10">Contact Us</a>
          </div>

          <p className="mt-8 max-w-lg text-sm text-cream/70">
            Aaharika is not just a catering service — we help you create memorable events with
            great food, premium service and complete event-management support.
          </p>
        </div>
      </div>
    </section>
  );
}
