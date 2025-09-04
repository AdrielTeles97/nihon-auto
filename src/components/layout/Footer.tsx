import { Button } from '@/components/ui/button'
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-accent flex items-center justify-center">
                <span className="text-primary font-bold text-sm">N</span>
              </div>
              <span className="font-playfair text-xl font-bold">Nihon Peças e Acessórios</span>
            </div>
            <p className="text-sm text-primary-foreground/80 text-pretty">
              Especialistas em peças e acessórios automotivos com mais de 15 anos de experiência no mercado brasileiro.
            </p>
            <div className="flex space-x-3">
              <Button size="icon" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Produtos</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors">Abraçadeiras</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors">Peças de Motor</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors">Acessórios Externos</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors">Ferramentas</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors">Equipamentos</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contato</h3>
            <div className="space-y-3 text-sm text-primary-foreground/80">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <a href="https://wa.me/559182337100" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors">
                  559182337100
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:vendas01@nihonauto.com.br" className="hover:text-primary-foreground transition-colors">
                  vendas01@nihonauto.com.br
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Travessa José Pio, 541 - Umarizal - Belém/PA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-sm text-primary-foreground/60 space-y-1">
          <p>&copy; {year} Nihon Peças e Acessórios. Todos os direitos reservados.</p>
          <p>
            Developer by: <a href="https://github.com/AdrielTeles97" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary-foreground">Adriel Teles</a>
          </p>
        </div>
      </div>
    </footer>
  )
}

