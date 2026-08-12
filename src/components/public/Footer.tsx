import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-serif text-2xl font-bold text-gold">Aaharika</h3>
          <p className="mt-1 text-sm text-cream/70">Flavours Made for Memories</p>
          <p className="mt-4 max-w-xs text-sm text-cream/70">
            Premium catering &amp; complete event management in Kolkata and surrounding areas —
            Bengali, Indo-Chinese &amp; Mughlai cuisine for every celebration.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gold">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-cream/70">
            <li><a className="hover:text-gold" href="/#home">Home</a></li>
            <li><a className="hover:text-gold" href="/#menus">Our Menus</a></li>
            <li><a className="hover:text-gold" href="/#dishes">Dishes We Serve</a></li>
            <li><a className="hover:text-gold" href="/#events">Events We Manage</a></li>
            <li><a className="hover:text-gold" href="/#testimonials">Testimonials</a></li>
            <li><a className="hover:text-gold" href="/#contact">Contact Us</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gold">Admin</h4>
          <ul className="mt-4 space-y-2 text-sm text-cream/70">
            <li><Link className="hover:text-gold" href="/admin/login">Admin Login</Link></li>
            <li><Link className="hover:text-gold" href="/admin/signup">Admin Signup</Link></li>
            <li><Link className="hover:text-gold" href="/admin/dashboard">Admin Dashboard</Link></li>
            <li><Link className="hover:text-gold" href="/admin/menus">Menu Management</Link></li>
            <li><Link className="hover:text-gold" href="/admin/dishes">Dish Management</Link></li>
            <li><Link className="hover:text-gold" href="/admin/orders">Order Management</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gold">Reach Us</h4>
          <ul className="mt-4 space-y-2 text-sm text-cream/70">
            <li>Kolkata, West Bengal, India</li>
            <li>
              <a className="hover:text-gold" href="mailto:soumikmondal723@gmail.com">
                soumikmondal723@gmail.com
              </a>
            </li>
            <li>
              <a
                className="hover:text-gold"
                href="https://maps.app.goo.gl/C3Zh5fEdCxueeBsL7"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Google Maps
              </a>
            </li>
          </ul>
          <div className="mt-4 flex gap-3">
            {["Facebook", "Instagram", "WhatsApp"].map((s) => (
              <span
                key={s}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-cream/10 text-xs text-cream/70"
                title={s}
              >
                {s[0]}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10 py-5 text-center text-sm text-cream/60">
        copyright@soumikmondal723
      </div>
    </footer>
  );
}
