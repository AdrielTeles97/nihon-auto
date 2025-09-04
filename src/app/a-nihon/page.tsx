"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "motion/react"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroHeader } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { CurvedTextLoop } from "@/components/motion-primitives/curved-text-loop"

export default function ANihonPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroHeader />
      <main className="relative overflow-hidden">
        <SectionBackground />

        <section className="relative py-16 md:py-28">
          <div className="mx-auto max-w-5xl space-y-10 px-6 md:space-y-14">
            <header className="space-y-3 text-center">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                A Nihon Acessórios Automotivos
              </h1>
              <p className="text-muted-foreground">
                Paixão por carros e pela experiência de dirigir.
              </p>
            </header>

            <div className="relative">
              <CurvedTextLoop
                className="text-xs md:text-sm opacity-60"
                text="NIHON ACESSÓRIOS AUTOMOTIVOS • ACESSÓRIOS • PERFORMANCE • ESTILO • CONFORTO • "
                speedSeconds={22}
              />
            </div>

            <DottedSeparator />

            <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-start">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="order-2 md:order-1"
              >
                <div className="space-y-6 leading-relaxed text-base">
                  <p>
                    Na Nihon, somos apaixonados por carros e pela experiência de dirigir. Com uma vasta gama de acessórios de alta qualidade, estamos aqui para transformar seu veículo em uma extensão perfeita de seu estilo e necessidades. Desde itens de conforto e conveniência até soluções de desempenho e estética, nossa missão é proporcionar o melhor para você e seu carro.
                  </p>

                  <SectionTitle title="Nossa Filosofia" />
                  <p>
                    Acreditamos que cada veículo é único e deve refletir a personalidade de seu proprietário. Por isso, selecionamos cuidadosamente nossos produtos para garantir que você encontre exatamente o que precisa para personalizar e melhorar seu automóvel.
                  </p>

                  <SectionTitle title="O Que Oferecemos" />
                  <p>
                    Nossa linha de acessórios é projetada para atender aos mais altos padrões de qualidade e durabilidade. Trabalhamos apenas com marcas reconhecidas e testadas para garantir que cada item oferecido seja uma adição valiosa ao seu carro.
                  </p>

                  <SectionTitle title="Nossa Localização" />
                  <p>
                    Venha nos visitar na Travessa José Pio, 541 - Umarizal, Belém. Nossa equipe está pronta para receber você com atendimento especializado e tirar todas as suas dúvidas sobre nossos produtos e serviços.
                  </p>

                  <p>
                    Na Nihon Acessórios Automotivos, você encontra não apenas produtos, mas também um compromisso com a excelência e a satisfação do cliente. Estamos aqui para ajudar você a transformar seu veículo em algo realmente especial.
                  </p>
                  <p>
                    Esperamos por você!
                  </p>

                  <p className="font-medium">Equipe Nihon Acessórios Automotivos</p>

                  <div className="pt-3">
                    <Button asChild size="lg" className="gap-2">
                      <Link
                        href="https://wa.me/5591999999999"
                        aria-label="Falar no WhatsApp"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Falar no WhatsApp
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="order-1 md:order-2"
              >
                <Image
                  src="https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=1600&auto=format&fit=crop"
                  alt="Equipe Nihon em ação"
                  width={1200}
                  height={900}
                  className="rounded-[var(--radius)] grayscale object-cover shadow-md"
                />
              </motion.div>
            </div>

            <DottedSeparator className="mt-6" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-[1px] w-6 bg-foreground/30" />
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
    </div>
  )
}

function SectionBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden text-black/20 dark:text-white/15">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Vertical premium guideline (center) */}
      <div
        aria-hidden
        className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 opacity-30"
        style={{
          backgroundImage: "repeating-linear-gradient(180deg, currentColor 0 6px, transparent 6px 12px)",
        }}
      />

      {/* Container-aligned vertical guides (left/right edges) */}
      <div className="absolute inset-y-0 left-0 right-0" aria-hidden>
        <div className="mx-auto max-w-5xl px-6 h-full relative">
          <div
            className="absolute left-0 top-0 h-full w-px opacity-50"
            style={{
              backgroundImage:
                "repeating-linear-gradient(180deg, currentColor 0 12px, transparent 12px 24px)",
            }}
          />
          <div
            className="absolute right-0 top-0 h-full w-px opacity-50"
            style={{
              backgroundImage:
                "repeating-linear-gradient(180deg, currentColor 0 12px, transparent 12px 24px)",
            }}
          />
        </div>
      </div>
      {/* Subtle top, middle and bottom separators aligned to container */}
      <div className="absolute inset-x-0 top-28 opacity-50" aria-hidden>
        <div className="mx-auto max-w-5xl px-6">
          <div
            className="h-[2px] w-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, currentColor 0 10px, transparent 10px 18px)",
            }}
          />
        </div>
      </div>

      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-50" aria-hidden>
        <div className="mx-auto max-w-5xl px-6">
          <div
            className="h-[2px] w-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, currentColor 0 10px, transparent 10px 18px)",
            }}
          />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-28 opacity-50" aria-hidden>
        <div className="mx-auto max-w-5xl px-6">
          <div
            className="h-[2px] w-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, currentColor 0 10px, transparent 10px 18px)",
            }}
          />
        </div>
      </div>
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-16 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.8) 0 10px, transparent 10px 20px)",
        }}
      />
    </div>
  )
}

function DottedSeparator({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`text-foreground/40 ${className}`}
    >
      <div
        className="h-px w-full"
        style={{
          backgroundImage: "repeating-linear-gradient(90deg, currentColor 0 8px, transparent 8px 16px)",
          opacity: 0.35,
        }}
      />
    </div>
  )
}
