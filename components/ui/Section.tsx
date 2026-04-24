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
            <div className="mb-5 inline-flex items-center rounded-lg border border-[rgba(28,43,24,0.12)] bg-[#f4f7f5] px-3 py-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1f5230]">
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
