'use client'

import { useRef, useState } from 'react'

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
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className="overflow-hidden rounded-2xl transition-all duration-200"
      style={{
        background: '#ffffff',
        border: `1px solid ${isOpen ? 'rgba(31,82,48,0.20)' : 'rgba(22,33,19,0.08)'}`,
        boxShadow: isOpen ? '0 4px 20px rgba(31,82,48,0.08)' : 'none',
      }}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-base font-semibold leading-snug" style={{ color: '#162113' }}>
          {faq.q}
        </span>
        <span
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-base font-bold transition-all duration-300"
          style={{
            background: isOpen ? '#1f5230' : 'rgba(22,33,19,0.06)',
            color: isOpen ? '#ffffff' : '#162113',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          +
        </span>
      </button>

      <div
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight ?? 300}px` : '0px',
          opacity: isOpen ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.35s ease, opacity 0.25s ease',
        }}
      >
        <div ref={contentRef} className="px-6 pb-6">
          <div className="mb-4 h-px" style={{ background: 'rgba(22,33,19,0.07)' }} />
          <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>
            {faq.a}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="bg-[#f8faf8] px-6 py-28">
      <div className="mx-auto max-w-3xl">
        <div className="mb-14 text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ color: '#1f5230' }}>
            Dúvidas
          </p>
          <h2 className="text-4xl font-extrabold md:text-5xl" style={{ color: '#162113' }}>
            Perguntas frequentes
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>

        <p className="mt-10 text-center text-sm" style={{ color: '#9ca3af' }}>
          Ainda tem dúvida?{' '}
          <a
            href="https://wa.me/5519981150397"
            className="font-semibold transition-colors hover:opacity-80"
            style={{ color: '#1f5230' }}
          >
            Fale com a gente no WhatsApp →
          </a>
        </p>
      </div>
    </section>
  )
}
