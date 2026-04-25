import type { ReactNode } from 'react'

type SectionProps = {
  eyebrow?: ReactNode
  title?: ReactNode
  subtitle?: ReactNode
  children: ReactNode
  className?: string
  contentClassName?: string
}

export default function Section({
  eyebrow,
  title,
  subtitle,
  children,
  className = '',
  contentClassName = '',
}: SectionProps) {
  const rootClassName = ['mx-auto max-w-6xl px-6', className].filter(Boolean).join(' ')
  const bodyClassName = ['mt-14', contentClassName].filter(Boolean).join(' ')

  return (
    <section className={rootClassName}>
      {(eyebrow || title || subtitle) && (
        <div className="text-center">
          {eyebrow && (
            <div
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgba(31,82,48,0.18)] bg-[linear-gradient(135deg,#f0faf4,#e3f5e9)] px-4 py-2"
              style={{
                boxShadow:
                  '0 1px 2px rgba(31,82,48,0.08), 0 4px 16px rgba(31,82,48,0.06)',
              }}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#1f5230] animate-pulse" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#1f5230]">
                {eyebrow}
              </span>
            </div>
          )}
          {title && <h2 className="text-3xl font-bold text-[#162113] md:text-4xl">{title}</h2>}
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#4f6347] md:text-[15px]">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  )
}
