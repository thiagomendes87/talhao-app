import Reveal from '@/components/ui/Reveal'

const sources = ['SICAR', 'SIGEF', 'SNCI', 'TOPODATA']

export default function TrustStrip() {
  return (
    <section className="border-y border-[rgba(22,33,19,0.06)] bg-white py-10">
      <Reveal className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
            Dados oficiais de
          </p>

          <div className="flex flex-wrap items-center gap-y-2 text-[13px] text-[#4f6347] md:justify-end">
            {sources.map((source, index) => (
              <div key={source} className="flex items-center">
                {index > 0 && (
                  <span
                    aria-hidden="true"
                    className="mx-3 h-4 w-px bg-[rgba(22,33,19,0.08)]"
                  />
                )}
                <span className="font-mono-tabular transition-colors duration-200 hover:text-[#1f5230]">
                  {source}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
