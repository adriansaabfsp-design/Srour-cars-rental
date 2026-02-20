import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Srour Cars Rental | Luxury Car Rentals in Lebanon",
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
        <Navbar />
        {children}
        <footer id="contact" className="border-t border-white/5 bg-black">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-12 sm:grid-cols-3">
              {/* Brand */}
              <div className="flex flex-col items-center sm:items-start">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-2xl font-bold tracking-wider text-white">
                    SROUR
                  </span>
                  <span className="text-2xl font-light tracking-[0.4em] text-gold">CARS</span>
                </div>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/30 text-center sm:text-left">
                  Your premier destination for luxury car rentals in Lebanon.
                </p>
              </div>

              {/* Quick Links */}
              <div className="flex flex-col items-center sm:items-start">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 mb-4">Quick Links</h4>
                <div className="flex flex-col gap-2">
                  <a href="/" className="text-sm text-white/30 transition-colors hover:text-gold">Home</a>
                  <a href="/#collection" className="text-sm text-white/30 transition-colors hover:text-gold">Collection</a>
                  <a href="/#contact" className="text-sm text-white/30 transition-colors hover:text-gold">Contact</a>
                  <a href="/admin" className="text-sm text-white/30 transition-colors hover:text-gold">Admin Panel</a>
                </div>
              </div>

              {/* Contact */}
              <div className="flex flex-col items-center sm:items-start">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 mb-4">Get in Touch</h4>
                <p className="text-sm leading-relaxed text-white/30 text-center sm:text-left">
                  Interested in renting? Reach out via WhatsApp for immediate assistance.
                </p>
                <a
                  href="https://wa.me/961"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 border border-gold/30 bg-gold/5 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-gold transition-all hover:bg-gold hover:text-black"
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
                &copy; {new Date().getFullYear()} SROUR CARS RENTAL. ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
