export default function TrustBand() {
  const sources = [
    { label: 'SICAR', sub: 'IBAMA / MMA' },
    { label: 'SIGEF', sub: 'INCRA' },
    { label: 'SNCI', sub: 'INCRA' },
    { label: 'Topodata', sub: 'INPE' },
  ]

  return (
    <div className="border-b border-gray-100 bg-white px-6 py-4">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Dados oficiais do governo federal
        </span>
        <div className="hidden h-4 w-px bg-gray-200 sm:block" />
        <div className="flex flex-wrap items-center justify-center gap-3">
          {sources.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold"
              style={{
                background: 'rgba(31,82,48,0.06)',
                borderColor: 'rgba(31,82,48,0.15)',
                color: '#1f5230',
              }}
            >
              <span
                className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                style={{ background: '#1f5230' }}
              />
              {s.label}
              <span className="font-normal text-gray-400">· {s.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
