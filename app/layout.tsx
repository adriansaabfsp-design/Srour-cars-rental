import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Image from "next/image";
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
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
              {/* Brand */}
              <div className="flex flex-col items-center sm:items-start">
                <Image
                  src="/logo.png"
                  alt="Lebanon Rental"
                  width={200}
                  height={200}
                  className="h-20 w-auto"
                />
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
                  className="mt-3 text-[11px] font-bold uppercase tracking-[0.15em] text-navy transition-colors hover:text-white"
                >
                  lebanon-rental.com &rarr;
                </a>
                {/* Social Icons */}
                <div className="mt-4 flex items-center gap-3">
                  <a href="https://www.instagram.com/lebanon.rental" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-8 w-8 items-center justify-center border border-navy/30 text-navy/50 transition-all hover:border-white/20 hover:text-white">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                  <a href="https://www.facebook.com/share/1AidWBciia/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-8 w-8 items-center justify-center border border-navy/30 text-navy/50 transition-all hover:border-white/20 hover:text-white">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href="https://www.tiktok.com/@lebanon.rental" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="flex h-8 w-8 items-center justify-center border border-navy/30 text-navy/50 transition-all hover:border-white/20 hover:text-white">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div className="flex flex-col items-center sm:items-start">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 mb-4">Quick Links</h4>
                <div className="flex flex-col gap-2">
                  <a href="/" className="text-sm text-white/30 transition-colors hover:text-white">Home</a>
                  <a href="/#collection" className="text-sm text-white/30 transition-colors hover:text-white">Collection</a>
                  <a href="/road-trips" className="text-sm text-white/30 transition-colors hover:text-white">Road Trips</a>
                  <a href="/seasonal-guide" className="text-sm text-white/30 transition-colors hover:text-white">Seasonal Guide</a>
                  <a href="/faq" className="text-sm text-white/30 transition-colors hover:text-white">FAQ</a>
                  <a href="/admin" className="text-sm text-white/30 transition-colors hover:text-white">Admin Panel</a>
                </div>
              </div>

              {/* Our Locations */}
              <div className="flex flex-col items-center sm:items-start">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 mb-4">Our Locations</h4>
                <div className="flex flex-col gap-2">
                  <a href="/car-rental-beirut" className="text-sm text-white/30 transition-colors hover:text-white">Beirut</a>
                  <a href="/car-rental-tripoli" className="text-sm text-white/30 transition-colors hover:text-white">Tripoli</a>
                  <a href="/car-rental-jounieh" className="text-sm text-white/30 transition-colors hover:text-white">Jounieh</a>
                  <a href="/car-rental-batroun" className="text-sm text-white/30 transition-colors hover:text-white">Batroun</a>
                  <a href="/car-rental-jbeil" className="text-sm text-white/30 transition-colors hover:text-white">Jbeil (Byblos)</a>
                  <a href="/car-rental-sidon" className="text-sm text-white/30 transition-colors hover:text-white">Sidon</a>
                  <a href="/car-rental-tyre" className="text-sm text-white/30 transition-colors hover:text-white">Tyre</a>
                  <a href="/car-rental-faraya" className="text-sm text-white/30 transition-colors hover:text-white">Faraya</a>
                  <a href="/car-rental-zahle" className="text-sm text-white/30 transition-colors hover:text-white">Zahle</a>
                </div>
              </div>

              {/* Contact */}
              <div className="flex flex-col items-center sm:items-start">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 mb-4">Get in Touch</h4>
                <div className="space-y-3 text-sm text-white/30 text-center sm:text-left">
                  <p className="flex items-center gap-2 justify-center sm:justify-start">
                    <svg className="h-4 w-4 text-navy/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Main Road, Amioûn, Liban-Nord, Lebanon
                  </p>
                  <p className="flex items-center gap-2 justify-center sm:justify-start">
                    <svg className="h-4 w-4 text-navy/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href="tel:+96181062329" className="transition-colors hover:text-white">+961 81 062 329</a>
                  </p>
                  <p className="flex items-center gap-2 justify-center sm:justify-start">
                    <svg className="h-4 w-4 text-navy/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href="mailto:support@lebanon-rental.com" className="transition-colors hover:text-white">support@lebanon-rental.com</a>
                  </p>
                </div>
                <a
                  href="https://wa.me/96181062329"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 border border-[#25D366]/30 bg-[#25D366]/5 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#25D366] transition-all hover:bg-[#25D366] hover:text-white"
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
