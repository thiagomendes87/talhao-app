'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Reveal from '@/components/ui/Reveal'
import Section from '@/components/ui/Section'

type Persona = {
  id: string
  label: string
  scenarioTitle: string
  narrative: string
  benefits: string[]
  previewBadge: string
  previewMetric: string
  previewNote: string
  previewChips: string[]
}

const personas: Persona[] = [
  {
    id: 'brokers',
    label: 'Corretores & Imobiliárias',
    scenarioTitle: 'Corretor fechando uma venda',
    narrative:
      'Encontre os limites exatos de qualquer fazenda antes da visita e chegue à conversa com a área aberta no mapa. Baixe o arquivo na hora e mostre ao cliente no Google Earth, sem depender de equipe técnica para preparar o material.',
    benefits: [
      'Mostra limites oficiais antes da visita',
      'Abre o polígono no Google Earth em minutos',
      'Passa mais confiança na apresentação do imóvel',
    ],
    previewBadge: 'Visita agendada',
    previewMetric: 'CAR + polígono',
    previewNote: 'Cliente vê a área com contexto visual imediato.',
    previewChips: ['Google Earth', 'KML', 'Visita'],
  },
  {
    id: 'owners',
    label: 'Proprietários Rurais',
    scenarioTitle: 'Produtor organizando a regularização',
    narrative:
      'Confira os limites oficiais da sua propriedade com segurança antes de protocolar qualquer documento. Detecte sobreposições com vizinhos e leve os arquivos certos para o cartório ou para a regularização, sem curva de aprendizado.',
    benefits: [
      'Confere limites oficiais da fazenda',
      'Identifica sobreposições com vizinhos',
      'Leva arquivos prontos para cartório e registro',
    ],
    previewBadge: 'Regularização',
    previewMetric: 'Limites oficiais',
    previewNote: 'Sobreposição destacada para conferência rápida.',
    previewChips: ['Cartório', 'CAR', 'Confrontantes'],
  },
  {
    id: 'investors',
    label: 'Investidores de Terras',
    scenarioTitle: 'Investidor filtrando uma oportunidade',
    narrative:
      'Analise qualquer gleba com dados reais antes de entrar numa negociação. Área, documentação, topografia e localização aparecem em segundos para você comparar ativos com mais critério e reduzir diligência manual.',
    benefits: [
      'Compara áreas e localização com rapidez',
      'Valida topografia antes da proposta',
      'Entra na diligência com dados reais na mesa',
    ],
    previewBadge: 'Análise de aquisição',
    previewMetric: '851 ha',
    previewNote: 'Topografia e localização lado a lado na decisão.',
    previewChips: ['Altitude', 'Declividade', 'Valuation'],
  },
  {
    id: 'legal',
    label: 'Advogados & Cartórios',
    scenarioTitle: 'Jurídico conferindo a base espacial',
    narrative:
      'Acesse matrículas georreferenciadas do INCRA, shapefiles e bases oficiais sem depender de montagem manual. Isso acelera processos, registros e due diligence com uma base espacial mais confiável para conferência.',
    benefits: [
      'Reúne bases oficiais em poucos minutos',
      'Apoia due diligence e registro com mais contexto',
      'Organiza prova espacial para conferência e processo',
    ],
    previewBadge: 'Due diligence',
    previewMetric: 'INCRA + matrícula',
    previewNote: 'Base espacial pronta para registro e auditoria.',
    previewChips: ['SIGEF', 'SNCI', 'Compliance'],
  },
]

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function PersonaMockup({ persona }: { persona: Persona }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[rgba(22,33,19,0.08)] bg-white shadow-[0_1px_3px_rgba(22,33,19,0.05),0_18px_40px_rgba(22,33,19,0.07)]">
      <div className="flex items-center gap-2 border-b border-[rgba(22,33,19,0.06)] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#d1d5db]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#bbf7d0]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#9ca3af]" />
        <span className="ml-2 text-[11px] font-medium text-[#6b7280]">talhao.ai/mapa</span>
      </div>

      <div className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbf9_0%,#eef5f0_100%)] p-4">
        <div className="absolute inset-0 bg-grid-dots opacity-60" />
        <div className="absolute right-6 top-6 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(82,183,136,0.20),transparent_68%)] blur-2xl" />

        <div className="relative grid gap-4 lg:grid-cols-[1fr_150px]">
          <div className="overflow-hidden rounded-2xl border border-[rgba(22,33,19,0.08)] bg-[#e8efe9]">
            <div className="flex items-center justify-between border-b border-[rgba(22,33,19,0.06)] bg-white/80 px-3 py-2">
              <span className="text-[11px] font-medium text-[#4f6347]">{persona.previewBadge}</span>
              <span className="rounded-full bg-[rgba(31,82,48,0.08)] px-2 py-1 font-mono-tabular text-[10px] text-[#1f5230]">
                mapa
              </span>
            </div>

            <div className="relative h-[210px] bg-[linear-gradient(135deg,#36543a_0%,#5c7b53_35%,#6f8c57_60%,#2a3f2c_100%)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(255,255,255,0.20),transparent_20%),radial-gradient(circle_at_70%_38%,rgba(255,255,255,0.10),transparent_18%),linear-gradient(45deg,rgba(255,255,255,0.05)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.05)_50%,rgba(255,255,255,0.05)_75%,transparent_75%,transparent)] bg-[length:22px_22px]" />
              <svg viewBox="0 0 420 240" className="absolute inset-0 h-full w-full">
                <polyline
                  points="18,170 68,110 132,126 182,82 248,94 312,58 384,86"
                  fill="none"
                  stroke="rgba(255,255,255,0.28)"
                  strokeWidth="2"
                />
                <polyline
                  points="30,196 96,146 172,152 238,120 318,132 392,96"
                  fill="none"
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="2"
                />
                <polygon
                  points="110,160 150,84 238,72 296,124 264,198 154,204"
                  fill="rgba(134,239,172,0.18)"
                  stroke="#86efac"
                  strokeWidth="3"
                />
                <circle cx="212" cy="136" r="8" fill="#bbf7d0" stroke="#14532d" strokeWidth="2" />
              </svg>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-[rgba(22,33,19,0.08)] bg-white/90 p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#4f6347]">
                contexto
              </p>
              <p className="mt-2 font-mono-tabular text-[18px] font-semibold text-[#162113]">
                {persona.previewMetric}
              </p>
              <p className="mt-2 text-[12px] leading-relaxed text-[#4f6347]">
                {persona.previewNote}
              </p>
            </div>

            <div className="rounded-2xl border border-[rgba(22,33,19,0.08)] bg-white/85 p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#4f6347]">
                fluxo
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {persona.previewChips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-[rgba(31,82,48,0.08)] px-2.5 py-1 text-[11px] font-medium text-[#1f5230]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ForWho() {
  const [selectedId, setSelectedId] = useState(personas[0].id)

  const activePersona = useMemo(() => {
    return personas.find((persona) => persona.id === selectedId) ?? personas[0]
  }, [selectedId])

  return (
    <section className="bg-white py-28">
      <Section
        eyebrow="Para quem é"
        title="Feito para quem trabalha com terra"
        subtitle="Sem jargão técnico. Sem curva de aprendizado."
        contentClassName="mt-16"
      >
        <Reveal>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
            <div className="space-y-2">
              {personas.map((persona) => {
                const isActive = persona.id === activePersona.id

                return (
                  <button
                    key={persona.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setSelectedId(persona.id)}
                    className={`w-full border-l-2 px-5 py-4 text-left transition-colors duration-200 ${
                      isActive
                        ? 'border-[#1f5230] bg-[rgba(31,82,48,0.04)] text-[#162113]'
                        : 'border-transparent text-[#6b7280] hover:bg-[rgba(31,82,48,0.03)] hover:text-[#162113]'
                    }`}
                  >
                    <span className={`text-[15px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                      {persona.label}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="min-h-[560px] lg:min-h-[460px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePersona.id}
                  initial={{ opacity: 0, y: 10, x: 10 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, y: -8, x: -10 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-[28px] border border-[rgba(22,33,19,0.08)] bg-[linear-gradient(180deg,#ffffff_0%,#fafcfa_100%)] p-6 shadow-[0_1px_3px_rgba(22,33,19,0.05),0_18px_44px_rgba(22,33,19,0.06)] sm:p-7"
                >
                  <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#4f6347]">
                        cenário
                      </p>
                      <h3 className="mt-3 text-[24px] font-semibold leading-tight text-[#162113]">
                        {activePersona.scenarioTitle}
                      </h3>
                      <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-[#4f6347]">
                        {activePersona.narrative}
                      </p>

                      <ul className="mt-6 space-y-3">
                        {activePersona.benefits.map((benefit) => (
                          <li key={benefit} className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(31,82,48,0.10)] text-[#1f5230]">
                              <CheckIcon />
                            </span>
                            <span className="text-[13px] leading-relaxed text-[#4f6347]">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <PersonaMockup persona={activePersona} />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </Section>
    </section>
  )
}
