'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

const faqs = [
  {
    q: 'O que é o CAR e por que ele é importante?',
    a: 'O CAR (Cadastro Ambiental Rural) é um registro eletrônico obrigatório para todos os imóveis rurais do Brasil. Ele contém os limites, a área e as informações ambientais de cada propriedade — e é exigido para acesso a crédito rural, regularização ambiental e compra e venda de terras.',
  },
  {
    q: 'Preciso ser técnico ou agrônomo para usar o Talhão?',
    a: 'Não. O Talhão foi criado para qualquer pessoa que precise de dados de uma fazenda — corretor, investidor, produtor ou advogado. Você navega no mapa, clica na propriedade e baixa o arquivo. Simples assim.',
  },
  {
    q: 'De onde vêm os dados?',
    a: 'O Talhão agrega dados de fontes oficiais do governo federal: SICAR (IBAMA), SIGEF e SNCI (INCRA) e Topodata (INPE). São os mesmos dados usados por órgãos públicos, bancos e cartórios.',
  },
  {
    q: 'Como funciona o sistema de créditos?',
    a: 'Cada download custa R$3,50 (1 crédito). Você compra um pacote de créditos — mínimo R$14 (4 downloads) — e usa quando precisar. Os créditos são válidos por 1 ano e não expiram.',
  },
  {
    q: 'Quais arquivos posso baixar?',
    a: 'KML (para Google Earth), Shapefile (para QGIS ou ArcGIS), GeoTIFF de altitude, mapas de declividade e imagens PNG do mapa. Tudo em um clique.',
  },
  {
    q: 'Os dados são atualizados?',
    a: 'Sim. Sincronizamos com as bases oficiais regularmente. Novos cadastros, retificações e atualizações são incorporados conforme aprovados pelos órgãos responsáveis.',
  },
  {
    q: 'Tenho uma empresa com muitos downloads. Tem plano corporativo?',
    a: 'Sim. Para escritórios de consultoria, bancos e imobiliárias rurais com alto volume, montamos propostas personalizadas. Fale com a gente pelo WhatsApp.',
  },
]

function Chevron({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      className={`h-4 w-4 flex-shrink-0 text-[#1f5230] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function FAQItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[0]
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-[rgba(22,33,19,0.08)] py-5">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-6 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-[15px] font-semibold text-[#162113]">{faq.q}</span>
        <Chevron isOpen={isOpen} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-[14px] leading-relaxed text-[#4f6347]">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center rounded-lg border border-[rgba(28,43,24,0.12)] bg-[#f4f7f5] px-3 py-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1f5230]">
              Dúvidas frequentes
            </span>
          </div>
          <h2 className="text-3xl font-bold text-[#162113]">Perguntas frequentes</h2>
        </div>

        <div>
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.q}
              faq={faq}
              isOpen={open === index}
              onToggle={() => setOpen(open === index ? null : index)}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-[14px] text-[#4f6347]">Ainda com dúvidas?</p>
          <a
            href="https://wa.me/5511530433330?text=Olá%2C%20tenho%20uma%20dúvida%20sobre%20o%20Talhão"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex rounded-xl bg-[#1f5230] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2a6b3f]"
          >
            Falar no WhatsApp →
          </a>
        </div>
      </div>
    </section>
  )
}
