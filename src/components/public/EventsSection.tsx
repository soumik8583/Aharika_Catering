const events = [
  { title: "Wedding", text: "Complete catering and event-management solutions for memorable weddings.", img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=70" },
  { title: "Birthday", text: "Delicious menus and beautiful arrangements for birthday celebrations.", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=70" },
  { title: "Anniversary", text: "Make your special milestone memorable with customized food and event services.", img: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=600&q=70" },
  { title: "Corporate Events", text: "Professional catering solutions for meetings, conferences and corporate celebrations.", img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=70" },
  { title: "Engagement", text: "Elegant catering and event arrangements for engagement ceremonies.", img: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&w=600&q=70" },
  { title: "Housewarming", text: "Traditional and modern catering options for housewarming celebrations.", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=70" },
  { title: "Puja & Religious Events", text: "Authentic food and event arrangements suitable for different ceremonies.", img: "https://images.unsplash.com/photo-1604608672516-f1b9b1d37076?auto=format&fit=crop&w=600&q=70" },
  { title: "Social Gatherings", text: "Flexible catering solutions for parties and private gatherings.", img: "https://images.unsplash.com/photo-1529543544282-cd1eddc0b0e2?auto=format&fit=crop&w=600&q=70" },
];

export default function EventsSection() {
  return (
    <section id="events" className="section bg-white">
      <div className="container-x text-center">
        <h2 className="section-title">Events We Manage</h2>
        <p className="section-subtitle">
          From intimate gatherings to grand celebrations — we manage them all.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {events.map((e) => (
            <div key={e.title} className="card group overflow-hidden text-left">
              <div className="relative h-40 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={e.img}
                  alt={`${e.title} catering and event management`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
                <h3 className="absolute bottom-3 left-4 font-serif text-lg font-bold text-white">
                  {e.title}
                </h3>
              </div>
              <div className="p-5">
                <p className="text-sm text-charcoal/70">{e.text}</p>
                <a href="#contact" className="btn-outline mt-4 w-full py-2 text-xs">
                  Book Us
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
