import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Nihon Auto Center - Catálogo Virtual",
  description:
    "Catálogo virtual de produtos automotivos da Nihon Auto Center. Encontre as melhores peças e acessórios para seu veículo.",
  keywords: "nihon auto, produtos automotivos, peças, acessórios, catálogo",
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
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}

