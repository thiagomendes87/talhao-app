import Reveal from '@/components/ui/Reveal'
import Section from '@/components/ui/Section'

type FormatCard = {
  extension: string
  title: string
  description: string
  preview: JSX.Element
}

function KmlPreview() {
  return (
    <div className="h-full w-full bg-[#fbfcfb] p-4">
      <pre className="font-mono-tabular text-[11px] leading-5 text-[#4f6347]">
        <span className="text-[#9ca3af]">{'<'}?</span>
        <span className="text-[#1f5230]">xml</span>
        <span className="text-[#4f6347]"> version=</span>
        <span className="text-[#b45309]">"1.0"</span>
        <span className="text-[#9ca3af]"> ?{'>'}</span>
        {'\n'}
        <span className="text-[#9ca3af]">{'<'}</span>
        <span className="text-[#1f5230]">Polygon</span>
        <span className="text-[#9ca3af]">{'>'}</span>
        {'\n  '}
        <span className="text-[#9ca3af]">{'<'}</span>
        <span className="text-[#1f5230]">coordinates</span>
        <span className="text-[#9ca3af]">{'>'}</span>
        {'\n    '}
        <span className="text-[#4f6347]">-49.234,-16.680,0</span>
        {'\n    '}
        <span className="text-[#4f6347]">-49.228,-16.674,0</span>
        {'\n    '}
        <span className="text-[#4f6347]">-49.220,-16.679,0</span>
        {'\n  '}
        <span className="text-[#9ca3af]">{'</'}</span>
        <span className="text-[#1f5230]">coordinates</span>
        <span className="text-[#9ca3af]">{'>'}</span>
        {'\n'}
        <span className="text-[#9ca3af]">{'</'}</span>
        <span className="text-[#1f5230]">Polygon</span>
        <span className="text-[#9ca3af]">{'>'}</span>
      </pre>
    </div>
  )
}

function ShapefilePreview() {
  const files = [
    { ext: '.shp', color: 'bg-[#D8F3DC]' },
    { ext: '.shx', color: 'bg-[#e9f7ec]' },
    { ext: '.dbf', color: 'bg-[#f4f7f5]' },
  ]

  return (
    <div className="flex h-full items-center justify-center gap-3 px-4">
      {files.map((file, index) => (
        <div
          key={file.ext}
          className={`relative w-20 rounded-xl border border-[rgba(22,33,19,0.08)] bg-white px-3 py-4 shadow-sm ${index === 1 ? '-translate-y-1' : ''}`}
        >
          <div className={`mb-4 h-8 rounded-lg ${file.color}`} />
          <div className="space-y-1">
            <div className="h-1.5 w-10 rounded-full bg-[rgba(22,33,19,0.12)]" />
            <div className="h-1.5 w-7 rounded-full bg-[rgba(22,33,19,0.08)]" />
          </div>
          <span className="mt-4 inline-block rounded-md bg-[rgba(31,82,48,0.08)] px-2 py-1 font-mono-tabular text-[10px] font-medium text-[#1f5230]">
            {file.ext}
          </span>
        </div>
      ))}
    </div>
  )
}

function GeoTiffPreview() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[10px] bg-[linear-gradient(180deg,#7c5a39_0%,#9b7b53_18%,#6d8a46_42%,#4a6b3a_66%,#2f4f2e_100%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_70%_40%,rgba(255,255,255,0.12),transparent_22%),radial-gradient(circle_at_55%_78%,rgba(255,255,255,0.12),transparent_18%)]" />
      <div className="absolute inset-x-0 bottom-0 h-10 bg-[linear-gradient(180deg,transparent,rgba(22,33,19,0.16))]" />
      <div className="absolute inset-x-4 top-5 border-t border-[rgba(255,255,255,0.24)]" />
      <div className="absolute inset-x-8 top-10 border-t border-[rgba(255,255,255,0.22)]" />
      <div className="absolute inset-x-6 top-16 border-t border-[rgba(255,255,255,0.18)]" />
      <div className="absolute inset-x-10 top-24 border-t border-[rgba(255,255,255,0.16)]" />
    </div>
  )
}

function PngPreview() {
  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-[rgba(22,33,19,0.08)] bg-[#dbe7d7] shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.24),transparent_18%),linear-gradient(135deg,#3f5b3b_0%,#6f8c57_35%,#5e7f6b_60%,#2b3f2b_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.05)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.05)_50%,rgba(255,255,255,0.05)_75%,transparent_75%,transparent)] bg-[length:18px_18px] opacity-40" />
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          <polygon
            points="18,62 30,26 68,20 80,46 73,78 36,82"
            fill="rgba(134,239,172,0.30)"
            stroke="#86efac"
            strokeWidth="2.2"
          />
        </svg>
      </div>
    </div>
  )
}

function DeclividadePreview() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[10px] bg-[linear-gradient(135deg,#facc15_0%,#fb923c_42%,#ef4444_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.14)_12.5%,transparent_12.5%,transparent_50%,rgba(255,255,255,0.14)_50%,rgba(255,255,255,0.14)_62.5%,transparent_62.5%,transparent)] bg-[length:18px_18px] opacity-70" />
      <div className="absolute bottom-3 left-3 right-3 flex h-2 overflow-hidden rounded-full border border-white/40">
        <div className="flex-1 bg-[#fde047]" />
        <div className="flex-1 bg-[#fb923c]" />
        <div className="flex-1 bg-[#ef4444]" />
      </div>
    </div>
  )
}

const formats: FormatCard[] = [
  {
    extension: '.kml',
    title: 'KML',
    description: 'Google Earth, Google Maps',
    preview: <KmlPreview />,
  },
  {
    extension: '.shp',
    title: 'Shapefile',
    description: 'QGIS, ArcGIS',
    preview: <ShapefilePreview />,
  },
  {
    extension: '.tif',
    title: 'GeoTIFF',
    description: 'Raster de altitude',
    preview: <GeoTiffPreview />,
  },
  {
    extension: '.png',
    title: 'PNG do mapa',
    description: 'Compartilhar rapidamente',
    preview: <PngPreview />,
  },
  {
    extension: '.slope',
    title: 'Declividade',
    description: 'Mapa de declividade em % ou graus',
    preview: <DeclividadePreview />,
  },
]

export default function OutputFormats() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="pointer-events-none absolute inset-0 bg-grid-dots opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 top-16 mx-auto h-64 max-w-5xl rounded-full bg-[radial-gradient(circle,rgba(82,183,136,0.12),transparent_68%)] blur-3xl" />

      <Section
        eyebrow="Formatos de saída"
        title="Arquivos prontos para seu fluxo"
        subtitle="Todos os formatos que o mercado geoespacial usa, gerados sob demanda."
        className="relative z-10"
        contentClassName="mt-16"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {formats.map((format, index) => (
            <Reveal key={format.title} delay={index * 0.08}>
              <article className="group rounded-2xl border border-[rgba(22,33,19,0.08)] bg-white p-6 transition duration-300 hover:border-[rgba(31,82,48,0.18)] hover:shadow-[0_0_0_3px_rgba(134,239,172,0.12),0_18px_36px_rgba(22,33,19,0.06)]">
                <span className="inline-flex rounded-lg bg-[rgba(31,82,48,0.08)] px-2.5 py-1 font-mono-tabular text-[11px] font-medium text-[#1f5230]">
                  {format.extension}
                </span>

                <div className="mt-5 h-[120px] overflow-hidden rounded-xl border border-[rgba(22,33,19,0.06)] bg-[#fafbfa] transition-transform duration-300 group-hover:scale-[1.02]">
                  {format.preview}
                </div>

                <h3 className="mt-5 text-[16px] font-semibold text-[#162113]">{format.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#4f6347]">{format.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>
    </section>
  )
}
