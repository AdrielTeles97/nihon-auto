"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "motion/react"
import { ChevronRight, Award, Users, Target, Heart, MapPin, Phone, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroHeader } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { NoiseBackground, DecorativeShape } from "@/components/ui/noise-shapes"
import { DividerLines } from "@/components/ui/divider-lines"
import { EmphasisText } from "@/components/ui/emphasis-text"

export default function ANihonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-red-950/20">
      <HeroHeader />
      
      <main className="relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 min-h-[80vh] flex items-center">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/a-nihon-background.webp"
              alt="Nihon Auto Background"
              fill
              className="object-cover"
              priority
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-transparent" />
          </div>
          
          <NoiseBackground intensity="medium" color="red" />
          <DecorativeShape variant="circle" color="red" size="lg" className="top-10 right-10 opacity-20" />
          <DecorativeShape variant="rectangle" color="red" size="md" className="bottom-20 left-10 opacity-15" />
          
          <div className="relative mx-auto max-w-7xl px-6 z-10">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6">
                  A <EmphasisText className="text-red-500">NIHON</EmphasisText>
                </h1>
                <h2 className="text-2xl md:text-4xl font-light text-neutral-300 mb-8">
                  Acessórios Automotivos
                </h2>
                <p className="text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
                  Paixão por carros e pela experiência de dirigir. Transformamos seu veículo 
                  em uma extensão perfeita do seu estilo e necessidades.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Por que escolher a Nihon Auto Section */}
        <section className="relative py-20 bg-gradient-to-br from-neutral-900/50 to-transparent">
          <DividerLines variant="red" />
          
          <div className="relative mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Por que escolher a <EmphasisText>Nihon Auto</EmphasisText>?
              </h2>
              <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
                Nossa experiência e dedicação garantem as melhores soluções em peças 
                automotivas japonesas para seu veículo
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Award,
                  title: "Qualidade Premium",
                  description: "Produtos de alta qualidade, testados e aprovados pelos melhores fabricantes do mercado automotivo japonês."
                },
                {
                  icon: Users,
                  title: "Atendimento Especializado", 
                  description: "Nossa equipe especializada está sempre pronta para ajudar você a encontrar a peça perfeita."
                },
                {
                  icon: Target,
                  title: "Foco em Resultados",
                  description: "Comprometidos em entregar exatamente o que você precisa com eficiência e qualidade."
                },
                {
                  icon: Heart,
                  title: "Paixão Automotiva",
                  description: "Movidos pela paixão por carros e pela experiência única de dirigir um veículo japonês."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center group-hover:bg-red-500/30 transition-colors duration-300">
                    <item.icon className="h-8 w-8 text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{item.title}</h3>
                  <p className="text-neutral-300 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Nossa História Section */}
        <section className="relative py-20 bg-gradient-to-br from-transparent to-neutral-900/50">
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                  Nossa <EmphasisText>História</EmphasisText>
                </h2>
                <div className="space-y-6 text-neutral-300">
                  <p className="text-lg leading-relaxed">
                    Na Nihon, somos apaixonados por carros japoneses e pela experiência única 
                    de dirigir. Com uma vasta gama de acessórios de alta qualidade, estamos 
                    aqui para transformar seu veículo em uma extensão perfeita de seu estilo.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Desde itens de conforto e conveniência até soluções de desempenho e estética, 
                    nossa missão é proporcionar o melhor para você e seu carro japonês.
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-6 mt-12">
                  {[
                    { value: "15+", label: "Anos de Experiência" },
                    { value: "10k+", label: "Clientes Satisfeitos" },
                    { value: "99%", label: "Satisfação" },
                    { value: "24/7", label: "Suporte" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                      <div className="text-2xl font-bold text-red-400">{stat.value}</div>
                      <div className="text-sm text-neutral-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Nossa Missão</h3>
                  <p className="text-neutral-300 leading-relaxed mb-8">
                    Proporcionar experiências únicas no mundo automotivo japonês, 
                    oferecendo produtos de qualidade superior que elevam o padrão 
                    do seu veículo e sua satisfação ao dirigir.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-red-400" />
                      <span className="text-white">Qualidade Garantida</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-red-400" />
                      <span className="text-white">Foco no Cliente</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Heart className="h-5 w-5 text-red-400" />
                      <span className="text-white">Paixão Automotiva</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Localização e Contato Section */}
        <section className="relative py-20">
          <DividerLines variant="red" />
          
          <div className="relative mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Visite Nossa <EmphasisText>Loja</EmphasisText>
              </h2>
              <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
                Atendimento especializado e produtos de qualidade para seu veículo japonês
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-red-400" />
                    Nossa Localização
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-lg text-white font-semibold">Endereço:</p>
                      <p className="text-neutral-300">
                        Travessa José Pio, 541<br />
                        Umarizal, Belém - PA
                      </p>
                    </div>
                    <p className="text-neutral-300 leading-relaxed">
                      Nossa equipe está pronta para receber você com atendimento 
                      especializado e tirar todas as suas dúvidas sobre nossos 
                      produtos e serviços.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <Phone className="h-6 w-6 text-red-400 mb-3" />
                    <p className="text-sm text-neutral-400">Telefone</p>
                    <p className="text-white font-semibold">(91) 9 8233-7100</p>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <Clock className="h-6 w-6 text-red-400 mb-3" />
                    <p className="text-sm text-neutral-400">Atendimento</p>
                    <p className="text-white font-semibold">24/7 Online</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-6">Esperamos por Você!</h3>
                  <p className="text-red-100 leading-relaxed mb-8">
                    Venha conhecer nossa linha completa de produtos japoneses e descubra 
                    como podemos transformar seu veículo em algo realmente especial.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-400/20 rounded-full flex items-center justify-center">
                        <Award className="h-6 w-6 text-red-300" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Atendimento Personalizado</h4>
                        <p className="text-red-200 text-sm">Especialistas em acessórios japoneses</p>
                      </div>
                    </div>
                    
                    <Button
                      asChild
                      size="lg"
                      className="w-full bg-white hover:bg-red-50 text-red-600"
                    >
                      <Link href="https://wa.me/5591982337100" target="_blank" className="flex items-center justify-center">
                        Falar no WhatsApp
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
