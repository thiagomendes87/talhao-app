const features = [
  {
    icon: '🗺',
    title: 'Todos os CAR do Brasil',
    desc: 'Mais de 10 milhões de polígonos do SICAR disponíveis, com status, área e perímetro.',
  },
  {
    icon: '📥',
    title: 'KML, SIGEF e muito mais',
    desc: 'Baixe os arquivos da propriedade rural em um clique. KML, SIGEF, SNCR e topografia.',
  },
  {
    icon: '🔲',
    title: 'Múltiplas camadas',
    desc: 'Sobreponha satélite, topografia, SNCR e SIGEF para uma análise completa.',
  },
]

export default function Features() {
  return (
    <section className="py-12 px-10 bg-white border-t border-gray-200">
      <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
        {features.map(f => (
          <div key={f.title} className="text-center px-6 py-6">
            <div className="w-12 h-12 bg-[#D8F3DC] rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
              {f.icon}
            </div>
            <h3 className="font-bold text-[#1A1A2E] mb-1.5">{f.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
