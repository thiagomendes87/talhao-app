'use client'

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
  }
]

function FAQItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: typeof faqs[0]
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div
      className="rounded-xl bg-white px-5 py-4 shadow-sm"
      style={{ border: '1px solid rgba(255,255,255,0.8)' }}
    >
      <button
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium text-gray-800">
          {faq.q}
        </span>
        <span className="flex-shrink-0 text-lg font-bold text-[#1a5c38]">
          {isOpen ? '×' : '+'}
        </span>
      </button>

      {isOpen ? (
        <div className="mt-3 border-t border-gray-100 pt-3 text-sm leading-relaxed text-gray-600">
          {faq.a}
        </div>
      ) : null}
    </div>
  )
}

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section
      id="faq"
      className="bg-gradient-to-br from-[#f0faf4] via-[#d1ead9] to-[#a8d5b5] px-6 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex flex-wrap items-start justify-between gap-8">
          <div>
            <div className="inline-flex items-center rounded-lg border border-[rgba(28,43,24,0.15)] bg-white/70 px-3 py-1.5 mb-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1f5230]">Dúvidas frequentes</span>
            </div>
            <h2 className="max-w-xs text-3xl font-bold text-[#162113]">
              Perguntas frequentes
            </h2>
          </div>
          <p className="max-w-sm text-base text-gray-600">
            Não encontrou sua resposta? Fale com a gente pelo WhatsApp.
          </p>
          <a
            href="https://wa.me/5511530433330?text=Olá%2C%20tenho%20uma%20dúvida%20sobre%20o%20Talhão"
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap rounded-full bg-[#1a5c38] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#15472d]"
          >
            💬 Falar no WhatsApp
          </a>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-gray-600">
          📧 Para outras dúvidas:{' '}
          <a
            href="mailto:ariel@talhao.ai"
            className="font-medium text-[#1a5c38] underline underline-offset-2"
          >
            ariel@talhao.ai
          </a>
        </p>
      </div>
    </section>
  )
}
