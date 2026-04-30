'use client'

import { useEffect, useState } from 'react'

type Props = {
  trigger: 'timer' | 'scroll'
  timerMs?: number
  scrollPct?: number
}

const WA_NUMBER = '551153043330'

export default function LeadCaptureSheet({
  trigger,
  timerMs = 20000,
  scrollPct = 40,
}: Props) {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [nome, setNome] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [fazenda, setFazenda] = useState('')

  useEffect(() => {
    if (dismissed) return

    try {
      const persistedDismissed = localStorage.getItem('lead_sheet_dismissed')
      if (persistedDismissed) {
        const ts = Number(persistedDismissed)
        if (Date.now() - ts < 7 * 24 * 60 * 60 * 1000) return
      }
    } catch {}

    if (trigger === 'timer') {
      const t = setTimeout(() => setVisible(true), timerMs)
      return () => clearTimeout(t)
    }

    if (trigger === 'scroll') {
      const handleScroll = () => {
        const maxScroll = document.body.scrollHeight - window.innerHeight
        if (maxScroll <= 0) return

        const pct = (window.scrollY / maxScroll) * 100
        if (pct >= scrollPct) setVisible(true)
      }

      window.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll()
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [dismissed, trigger, timerMs, scrollPct])

  const dismiss = () => {
    setVisible(false)
    setDismissed(true)
    try {
      localStorage.setItem('lead_sheet_dismissed', String(Date.now()))
    } catch {}
  }

  const handleSubmit = () => {
    const msg = encodeURIComponent(
      `Oi! Vi o case da Fazenda Três Barras na Talhão e quero uma análise da minha fazenda "${fazenda || 'minha fazenda'}". Me chamo ${nome}. Meu WhatsApp: ${whatsapp}.`
    )
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank', 'noopener,noreferrer')
    dismiss()
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[200] transition-transform duration-500 ease-out ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="relative mx-auto max-w-5xl rounded-t-3xl border border-b-0 border-[rgba(22,33,19,0.12)] bg-white px-6 py-6 shadow-[0_-12px_48px_rgba(22,33,19,0.14)] sm:px-10 sm:py-8">
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="Fechar"
        >
          &times;
        </button>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
          <div className="flex flex-col justify-between gap-4">
            <div>
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D8F3DC] bg-[#F0FDF4] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#2D6A4F]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2D6A4F]" />
                Case real · Talhão
              </span>
              <h2 className="text-xl font-extrabold leading-tight text-[#162113]">
                Fazenda Três Barras - relatório completo gerado pela Talhão
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Área total, uso do solo, sobreposições, riscos ambientais e avaliação de
                mercado - tudo em segundos.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Área total', value: '1.842 ha' },
                { label: 'Uso agrícola', value: '74%' },
                { label: 'Risco ambiental', value: 'Baixo' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-[rgba(22,33,19,0.08)] bg-[#F7FAF8] p-3 text-center"
                >
                  <p className="mb-1 text-xs uppercase tracking-wide text-gray-400">{s.label}</p>
                  <p className="text-base font-extrabold text-[#162113]">{s.value}</p>
                </div>
              ))}
            </div>

            <a
              href="/fazenda-tres-barras.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-[#2D6A4F] transition-colors hover:text-[#162113]"
            >
              Ver relatório completo -&gt;
            </a>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold text-[#162113]">
              Quer uma análise assim da sua fazenda?
            </p>

            <div className="flex flex-col gap-3">
              <input
                className="form-input"
                aria-label="Seu nome"
                autoComplete="name"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <input
                className="form-input"
                type="tel"
                aria-label="Seu WhatsApp com DDD"
                autoComplete="tel"
                placeholder="Seu WhatsApp (com DDD)"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
              />
              <input
                className="form-input"
                aria-label="Nome da fazenda"
                placeholder="Nome da fazenda (opcional)"
                value={fazenda}
                onChange={(e) => setFazenda(e.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!nome || !whatsapp}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1f5230] px-5 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(31,82,48,0.22)] transition hover:-translate-y-[1px] hover:bg-[#2a6b3f] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.524 5.855L.057 23.882l6.19-1.62A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.213-3.676.963.98-3.584-.234-.369A9.818 9.818 0 1112 21.818z" />
              </svg>
              Falar com a Talhão
            </button>

            <p className="text-center text-xs text-gray-400">Respondemos em até 1 dia útil</p>
          </div>
        </div>
      </div>
    </div>
  )
}
