import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-white" aria-label="Rodapé">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <Link href="/" className="flex items-center space-x-2" aria-label="Página inicial">
          <Image
            src="/images/logo-nihon.png"
            alt="Nihon Auto Center"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="font-semibold text-gray-900">Nihon Auto Center</span>
        </Link>
        <nav className="flex flex-col items-center gap-4 text-sm text-gray-600 sm:flex-row" aria-label="Links úteis">
          <Link href="/sobre" className="hover:text-gray-900">
            Sobre
          </Link>
          <Link href="/contato" className="hover:text-gray-900">
            Contato
          </Link>
          <Link href="/termos" className="hover:text-gray-900">
            Termos de uso
          </Link>
        </nav>
        <div className="flex items-center gap-4" aria-label="Redes sociais">
          <Link
            href="https://www.facebook.com/"
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 transition-colors hover:text-gray-900"
          >
            <Facebook className="h-5 w-5" />
          </Link>
          <Link
            href="https://www.instagram.com/"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 transition-colors hover:text-gray-900"
          >
            <Instagram className="h-5 w-5" />
          </Link>
          <Link
            href="https://www.youtube.com/"
            aria-label="YouTube"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 transition-colors hover:text-gray-900"
          >
            <Youtube className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
