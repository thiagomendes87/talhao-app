'use client'

import { useState } from 'react'

const faqs = [
  {
    q: 'O que é o CAR e por que ele é importante?',
    a: 'O CAR (Cadastro Ambiental Rural) é um registro eletrônico obrigatório para todos os imóveis rurais do Brasil. Ele contém a localização, os limites e as informações ambientais de cada propriedade. É a base legal para acesso ao crédito rural, regularização ambiental e compra e venda de terras.'
  },
  {
    q: 'De onde vêm os dados do Talhão?',
    a: 'Todos os dados são extraídos diretamente do SICAR (Sistema Nacional de Cadastro Ambiental Rural), que é a base de dados oficial do governo federal. Os arquivos KML refletem exatamente o que está registrado no sistema público.'
  },
  {
    q: 'Preciso ser engenheiro agrônomo ou técnico para usar?',
    a: 'Não. O Talhão foi criado para qualquer pessoa que precise de dados rurais — corretor, investidor, produtor ou consultor. A interface é simples: você busca pelo CPF/CNPJ, nome do proprietário ou localização, e baixa o arquivo.'
  },
  {
    q: 'Como funciona o sistema de créditos?',
    a: 'Cada download custa R$3,50. Você compra créditos antecipadamente (mínimo R$14,00 = 4 downloads) e vai usando conforme precisar. Os créditos não expiram. Para quem usa mais de 14 downloads por mês, o Plano Pro por R$49/mês é mais vantajoso.'
  },
  {
    q: 'Quais arquivos posso baixar?',
    a: 'Na versão atual: KML (Google Earth e outros SIGs), shapefile e PDF com resumo da propriedade. Em breve: SIGEF, INCRA e sobreposição com outras camadas temáticas como biomas, áreas embargadas e aptidão agrícola.'
  },
  {
    q: 'Os dados são atualizados com frequência?',
    a: 'Sim. A base do SICAR é atualizada periodicamente e o Talhão sincroniza automaticamente. Quando um CAR é retificado ou um novo cadastro é aprovado, a plataforma reflete essa mudança em até 24 horas.'
  },
  {
    q: 'Posso usar o Talhão para verificar sobreposições ou pendências?',
    a: 'Na versão atual você consegue visualizar o polígono da propriedade no mapa. As análises de sobreposição com APP, Reserva Legal e áreas embargadas estão previstas para versões futuras. Você pode exportar o KML e cruzar com outras bases no QGIS ou ArcGIS.'
  },
  {
    q: 'E se eu precisar de muitos downloads para uma empresa?',
    a: 'Temos planos corporativos sob medida para escritórios de consultoria, bancos e imobiliárias rurais com alto volume. Entre em contato via WhatsApp e montamos uma proposta personalizada.'
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="bg-gray-50 py-24 px-6">
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-14">
          <p className="text-[#2D6A4F] font-semibold text-sm uppercase tracking-widest mb-3">Dúvidas</p>
          <h2 className="text-4xl font-extrabold text-[#1A1A2E]">Perguntas frequentes</h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-semibold text-[#1A1A2E] text-base pr-4">{faq.q}</span>
                <span className={`text-[#2D6A4F] text-xl font-bold flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>

              {open === i && (
                <div className="px-6 pb-5">
                  <div className="h-px bg-gray-100 mb-4" />
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-10">
          Ainda tem dúvida?{' '}
          <a href="https://wa.me/5511999999999" className="text-[#2D6A4F] font-semibold hover:underline">
            Fale com a gente no WhatsApp
          </a>
        </p>
      </div>
    </section>
  )
}
