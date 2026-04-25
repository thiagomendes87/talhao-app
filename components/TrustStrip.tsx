const TRUST_ITEMS = [
  'Dados oficiais de SICAR',
  'Dados oficiais de SIGEF',
  'Dados oficiais de SNCI',
  'Dados oficiais do INPE',
]

function TrustRow({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center gap-8 pr-8 md:gap-10 md:pr-10"
    >
      {TRUST_ITEMS.map((item, index) => (
        <div key={`${item}-${index}`} className="flex items-center gap-8 md:gap-10">
          {index > 0 && (
            <span
              aria-hidden="true"
              className="font-mono-tabular text-[13px] font-light text-[rgba(22,33,19,0.20)]"
            >
              |
            </span>
          )}
          <span className="whitespace-nowrap font-mono-tabular text-[13px] font-medium text-[#4f6347]">
            {item}
          </span>
        </div>
      ))}
      <span
        aria-hidden="true"
        className="font-mono-tabular text-[13px] font-light text-[rgba(22,33,19,0.20)]"
      >
        |
      </span>
    </div>
  )
}

export default function TrustStrip() {
  return (
    <section className="relative overflow-hidden border-y border-[rgba(22,33,19,0.06)] bg-white py-8">
      <div className="glow-green-soft" />

      <div className="relative z-10 marquee-mask overflow-hidden">
        <div className="marquee-track">
          <TrustRow />
          <TrustRow ariaHidden />
          <TrustRow ariaHidden />
        </div>
      </div>
    </section>
  )
}
