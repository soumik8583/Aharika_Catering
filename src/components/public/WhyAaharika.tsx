const points = [
  {
    title: "Authentic Cuisine",
    text: "Specialists in Bengali, Indo-Chinese and Mughlai cuisine crafted by experienced chefs.",
  },
  {
    title: "Complete Event Management",
    text: "From catering and decoration to on-ground execution, we handle every detail of your event.",
  },
  {
    title: "Trusted in Kolkata",
    text: "Serving weddings, birthdays, corporate events and celebrations across Kolkata and beyond.",
  },
];

export default function WhyAaharika() {
  return (
    <section id="about" className="section bg-white">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=75"
            alt="Aaharika chefs preparing an elegant catering spread"
            loading="lazy"
            className="h-[420px] w-full rounded-3xl object-cover shadow-card"
          />
          <div className="absolute -bottom-6 -right-4 hidden rounded-2xl bg-brand px-6 py-5 text-white shadow-card sm:block">
            <p className="font-serif text-3xl font-bold text-gold">100%</p>
            <p className="text-sm text-cream/80">Fresh &amp; hygienic</p>
          </div>
        </div>

        <div>
          <h2 className="section-title text-left">Why Aaharika</h2>
          <p className="mt-4 text-charcoal/75">
            At Aaharika, we believe every celebration deserves food that delights and service that
            reassures. We combine authentic recipes, fresh ingredients and professional
            event-management to make your special moments effortless and memorable.
          </p>

          <div className="mt-8 space-y-5">
            {points.map((p) => (
              <div key={p.title} className="flex gap-4">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold-dark">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal">{p.title}</h3>
                  <p className="text-sm text-charcoal/70">{p.text}</p>
                </div>
              </div>
            ))}
          </div>

          <a href="#contact" className="btn-primary mt-8">Book Your Event</a>
        </div>
      </div>
    </section>
  );
}
