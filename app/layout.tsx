import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import TopBanner from "@/components/TopBanner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Lebanon Rental | Luxury Car Rentals in Lebanon",
  description:
    "Experience luxury on the road. Premium car rentals in Lebanon — from exotic supercars to elegant sedans.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <TopBanner />
        <Navbar />
        {children}
        <footer id="contact" className="border-t border-white/5 bg-black">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-12 sm:grid-cols-3">
              {/* Brand */}
              <div className="flex flex-col items-center sm:items-start">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-baseline">
                    <span className="font-serif text-2xl font-bold tracking-wider text-gold">Leb</span>
                    <span className="cedar-sun-glow relative inline-flex items-center justify-center mx-[-1px]">
                      <svg className="h-7 w-7 text-gold" viewBox="0 0 64 64" fill="currentColor">
                        <path d="M32 4c-1.2 3.2-4 6.4-4 9.6 0 2.4 1.6 4 2.8 5.6-2-.8-4.8-1.6-6.8-.8-2.4 1-3.2 3.2-2.4 5.2.8 1.6 2.8 2.8 4.4 3.2-2.4.4-5.6 1.2-7.2 3.2-1.4 2-.8 4.4.8 6 1.6 1.4 4 2 6 2-1.6 1.2-3.6 2.8-4 4.8-.4 2.4 1.2 4 3.2 4.8H32V4z" />
                        <path d="M32 4c1.2 3.2 4 6.4 4 9.6 0 2.4-1.6 4-2.8 5.6 2-.8 4.8-1.6 6.8-.8 2.4 1 3.2 3.2 2.4 5.2-.8 1.6-2.8 2.8-4.4 3.2 2.4.4 5.6 1.2 7.2 3.2 1.4 2 .8 4.4-.8 6-1.6 1.4-4 2-6 2 1.6 1.2 3.6 2.8 4 4.8.4 2.4-1.2 4-3.2 4.8H32V4z" />
                        <rect x="30" y="48" width="4" height="14" rx="1" />
                      </svg>
                    </span>
                    <span className="font-serif text-2xl font-bold tracking-wider text-gold">non</span>
                  </div>
                  <span className="text-lg font-bold uppercase tracking-[0.3em] text-gold/70">Rental</span>
                </div>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
                  A Lebanon Rental Company
                </p>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/30 text-center sm:text-left">
                  Your premier destination for luxury car rentals in Lebanon.
                </p>
                <a
                  href="https://lebanon-rental.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 text-[11px] font-bold uppercase tracking-[0.15em] text-gold/50 transition-colors hover:text-gold"
                >
                  lebanon-rental.com &rarr;
                </a>
              </div>

              {/* Quick Links */}
              <div className="flex flex-col items-center sm:items-start">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 mb-4">Quick Links</h4>
                <div className="flex flex-col gap-2">
                  <a href="/" className="text-sm text-white/30 transition-colors hover:text-gold">Home</a>
                  <a href="/#collection" className="text-sm text-white/30 transition-colors hover:text-gold">Collection</a>
                  <a href="/road-trips" className="text-sm text-white/30 transition-colors hover:text-gold">Road Trips</a>
                  <a href="/seasonal-guide" className="text-sm text-white/30 transition-colors hover:text-gold">Seasonal Guide</a>
                  <a href="/faq" className="text-sm text-white/30 transition-colors hover:text-gold">FAQ</a>
                  <a href="/admin" className="text-sm text-white/30 transition-colors hover:text-gold">Admin Panel</a>
                </div>
              </div>

              {/* Contact */}
              <div className="flex flex-col items-center sm:items-start">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 mb-4">Get in Touch</h4>
                <div className="space-y-3 text-sm text-white/30 text-center sm:text-left">
                  <p className="flex items-center gap-2 justify-center sm:justify-start">
                    <svg className="h-4 w-4 text-gold/40 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Main Road, Amioûn, Liban-Nord, Lebanon
                  </p>
                  <p className="flex items-center gap-2 justify-center sm:justify-start">
                    <svg className="h-4 w-4 text-gold/40 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href="tel:+96181062329" className="transition-colors hover:text-gold">+961 81 062 329</a>
                  </p>
                  <p className="flex items-center gap-2 justify-center sm:justify-start">
                    <svg className="h-4 w-4 text-gold/40 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href="mailto:support@lebanon-rental.com" className="transition-colors hover:text-gold">support@lebanon-rental.com</a>
                  </p>
                </div>
                <a
                  href="https://wa.me/96181062329"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 border border-gold/30 bg-gold/5 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-gold transition-all hover:bg-gold hover:text-black"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.356 0-4.57-.652-6.454-1.785l-.45-.27-2.527.847.847-2.527-.27-.45A9.965 9.965 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
                  </svg>
                  WhatsApp Us
                </a>
              </div>
            </div>

            <div className="mt-12 border-t border-white/5 pt-8 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">
                &copy; {new Date().getFullYear()} LEBANON RENTAL. ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
