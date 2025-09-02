import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "@/components/ui/sonner";
// import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Montecarlo - Catálogo Virtual",
  description: "Catálogo virtual de produtos automotivos Montecarlo. Encontre as melhores peças e acessórios para seu veículo.",
  keywords: "montecarlo, produtos automotivos, peças, acessórios, catálogo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body
        className={`${GeistSans.className} antialiased`}
      >
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
