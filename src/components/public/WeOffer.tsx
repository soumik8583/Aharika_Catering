const offers = [
  {
    title: "Taste",
    text: "Authentic flavours crafted to make every celebration memorable.",
    icon: "M12 2C8 6 6 9 6 13a6 6 0 0 0 12 0c0-4-2-7-6-11z",
  },
  {
    title: "Quality",
    text: "Fresh ingredients, hygienic preparation and consistent quality.",
    icon: "M20 6 9 17l-5-5",
  },
  {
    title: "Premium Service",
    text: "Professional catering and event-management from planning to execution.",
    icon: "M12 2l2.4 7.4H22l-6 4.6 2.3 7.4L12 17l-6.3 4.4L8 14 2 9.4h7.6z",
  },
  {
    title: "Cost Friendly",
    text: "Flexible packages designed to provide excellent value for your budget.",
    icon: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  },
];

export default function WeOffer() {
  return (
    <section className="section bg-cream">
      <div className="container-x text-center">
        <h2 className="section-title">We Offer</h2>
        <p className="section-subtitle">
          Everything you need for a flawless celebration, delivered with care.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {offers.map((o) => (
            <div
              key={o.title}
              className="card group p-7 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-card"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={o.icon} />
                </svg>
              </div>
              <h3 className="mt-5 font-serif text-xl font-bold text-charcoal">{o.title}</h3>
              <p className="mt-2 text-sm text-charcoal/70">{o.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
