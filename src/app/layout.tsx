import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import Navbar from "@/components/navbar";
import CartDrawer from "@/components/cart-drawer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "iPhone & Electronics | Octavio Store",
  description: "Sleek e-commerce with advanced motion & effects.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${inter.className}`} // <-- pre-render with dark on the server
      suppressHydrationWarning // <-- silence diffs while next-themes mounts
    >
      <body>
        <div className="gradient-mesh" aria-hidden />
        <Providers>
          <Navbar />
          <CartDrawer />
          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
