import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/cart-context";


export const metadata: Metadata = {
  title: "Nihon Acessórios automotivos - Catálogo Virtual",
  description:
    "Catálogo virtual de produtos automotivos da Nihon Acessórios Automotivos. Encontre as melhores peças e acessórios para seu veículo.",
  keywords: "nihon peças e acessórios automotivos, produtos automotivos, peças, acessórios, catálogo",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${manrope.variable}`}>
      <body className={`${manrope.className} antialiased`}>
          <CartProvider>
            {children}
          </CartProvider>

      </body>
    </html>
  );
}
