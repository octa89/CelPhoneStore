import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import Navbar from "@/components/navbar";
import CartDrawer from "@/components/cart-drawer";
import ContactFooter from "@/components/contact-footer";
import ChatWidget from "@/components/ChatWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://iphone-electro-store.vercel.app'),
  title: "Tecno Express | Tienda de Celulares y Tecnología",
  description: "Tu tienda de confianza para los mejores smartphones, tablets y accesorios tecnológicos. Envíos rápidos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={inter.className}
      suppressHydrationWarning
    >
      <body>
        <div className="gradient-mesh" aria-hidden />
        <Providers>
          <Navbar />
          <main>
            {children}
          </main>
          <ContactFooter />
          {/* Sidebars rendered at body level for proper fixed positioning */}
          <CartDrawer />
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}
