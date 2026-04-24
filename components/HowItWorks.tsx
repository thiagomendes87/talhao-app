import Reveal from '@/components/ui/Reveal'
import Section from '@/components/ui/Section'

const steps = [
  {
    num: '01',
    title: 'Encontre',
    desc: 'Busque por CAR, município ou coordenada. 10M+ polígonos indexados.',
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="6.5" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Inspecione',
    desc: 'Veja limites, área, topografia e declividade sobre satélite Mapbox.',
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 20s6-5.4 6-10a6 6 0 1 0-12 0c0 4.6 6 10 6 10Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Baixe',
    desc: 'KML, Shapefile ou GeoTIFF. Um clique. Funciona no Google Earth, QGIS, ArcGIS.',
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 4v10" />
        <path d="M8 11l4 4 4-4" />
        <path d="M5 19h14" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-white py-24">
      <Section
        eyebrow="Como funciona"
        title="De pesquisa a arquivo em 30 segundos"
        subtitle="Três passos, um clique cada. Sem cadastro para começar."
        contentClassName="mt-16"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {steps.map((step, index) => (
            <Reveal key={step.num} delay={index * 0.12} className="relative">
              <div className="rounded-2xl border border-[rgba(22,33,19,0.08)] bg-white p-7 transition duration-300 hover:-translate-y-[3px] hover:border-[rgba(31,82,48,0.25)]">
                <div className="mb-6 text-[#1f5230]">{step.icon}</div>
                <p className="font-mono-tabular text-[42px] font-bold leading-none text-[#1f5230]">
                  {step.num}
                </p>
                <h3 className="mt-5 text-[16px] font-semibold text-[#162113]">{step.title}</h3>
                <p className="mt-3 text-[13px] leading-relaxed text-[#4f6347]">{step.desc}</p>
              </div>

              {index < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="absolute left-full top-16 hidden h-px w-8 -translate-x-4 border-t border-dashed border-[rgba(22,33,19,0.14)] md:block"
                />
              )}
            </Reveal>
          ))}
        </div>
      </Section>
    </section>
  )
}
