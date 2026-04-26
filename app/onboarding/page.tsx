'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { buildLoginPath, supabase } from '@/lib/supabase'

const perfis = [
  { icon: '👨‍🌾', nome: 'Produtor Rural', desc: 'Uso próprio da propriedade' },
  { icon: '🧑‍💼', nome: 'Consultor Rural', desc: 'Consultoria agrícola' },
  { icon: '🏠', nome: 'Corretor / Imobiliária', desc: 'Compra e venda de imóveis' },
  { icon: '📈', nome: 'Investidor', desc: 'Compra de terra / Investimento' },
  { icon: '✏️', nome: 'Outro', desc: 'Especificar abaixo' },
]

const frases = [
  'Acesse dados de qualquer fazenda do Brasil em segundos — diretamente do satélite.',
  'Analise NDVI, cobertura vegetal e histórico de qualquer talhão do país.',
  'Exporte KML, Shapefile e PDF com um clique — compatível com qualquer sistema.',
  'Busque por CPF, CNPJ, coordenada ou nome da propriedade — resultado em 30s.',
]

function TypewriterText() {
  const [displayed, setDisplayed] = useState('')
  const [fraseIdx, setFraseIdx] = useState(0)
  const [deletando, setDeletando] = useState(false)
  const [pausado, setPausado] = useState(false)

  useEffect(() => {
    if (pausado) {
      const t = setTimeout(() => {
        setPausado(false)
        setDeletando(true)
      }, 2200)
      return () => clearTimeout(t)
    }

    const frase = frases[fraseIdx]
    const velocidade = deletando ? 18 : 38

    const t = setTimeout(() => {
      if (!deletando) {
        const next = frase.slice(0, displayed.length + 1)
        setDisplayed(next)
        if (next === frase) setPausado(true)
      } else {
        const next = displayed.slice(0, -1)
        setDisplayed(next)
        if (next === '') {
          setDeletando(false)
          setFraseIdx((i) => (i + 1) % frases.length)
        }
      }
    }, velocidade)

    return () => clearTimeout(t)
  }, [displayed, deletando, fraseIdx, pausado])

  return (
    <span>
      {displayed}
      <span className="ml-0.5 inline-block w-0.5 animate-pulse bg-white align-middle">
        &nbsp;
      </span>
    </span>
  )
}

export default function OnboardingPage() {
  const [perfilIdx, setPerfilIdx] = useState(0)
  const [outroPerfil, setOutroPerfil] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [usuario, setUsuario] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUsuario(session.user)
      } else if (event === 'SIGNED_OUT') {
        router.replace(
          buildLoginPath(
            '/onboarding',
            'Entre com sua conta Google para concluir seu perfil.',
          ),
        )
      }
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUsuario(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleContinuar = async () => {
    setCarregando(true)
    const perfilEscolhido =
      perfilIdx === perfis.length - 1 ? outroPerfil : perfis[perfilIdx].nome

    const { error } = await supabase.auth.updateUser({
      data: { perfil: perfilEscolhido },
    })

    if (usuario) {
      await supabase
        .from('perfis')
        .upsert({ id: usuario.id, perfil: perfilEscolhido }, { onConflict: 'id' })
    }

    if (error) {
      console.error(error)
    } else {
      router.push('/dashboard')
    }
    setCarregando(false)
  }

  return (
    <div className="h-screen overflow-hidden bg-white">
      <div className="grid h-full grid-cols-1 bg-white lg:grid-cols-2">
        <section className="relative hidden h-full overflow-hidden lg:flex">
          <Image
            src="/foto-lp1.png"
            alt="Vista de satélite de uma propriedade rural"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-[#162113]/70" />

          <div className="relative z-10 flex h-full w-full flex-col p-10">
            <Link href="/" className="inline-flex">
              <Image
                src="/logo-oficial-branco.png"
                width={360}
                height={96}
                alt="Talhão"
              />
            </Link>

            <div className="flex flex-1 items-center justify-center">
              <div className="w-full max-w-lg rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-md">
                <p className="min-h-[84px] text-xl font-semibold leading-relaxed text-white">
                  &ldquo;<TypewriterText />&rdquo;
                </p>
                <div className="mt-6 flex flex-wrap gap-6 whitespace-nowrap text-sm text-white/80">
                  <span>🛰 Satélite atualizado semanalmente</span>
                  <span>⚡ Resultados em menos de 30s</span>
                  <span>📍 100% do território brasileiro</span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 z-20 inline-flex items-center gap-2 rounded-full border border-[#40916C]/60 bg-[#40916C]/20 px-4 py-2 text-xs font-semibold text-[#B7E4C7] backdrop-blur-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-[#52b788] animate-pulse" />
            Sistema da Talhão está ativo
          </div>
        </section>

        <section className="flex h-full flex-col justify-center bg-white px-6 py-10 lg:px-16 lg:py-12">
          <div className="mx-auto w-full max-w-xl">
            <div className="rounded-full border border-[#D8F3DC] bg-[#F0FDF4] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#2D6A4F] inline-flex">
              Passo 1 de 1 — Seu perfil
            </div>
            <div className="mt-2 mb-6 h-0.5 w-8 bg-[#2D6A4F]" />

            <div className="relative inline-block">
              <div className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-[#F0FDF4] via-[#D8F3DC]/60 to-transparent blur-sm" />
              <h1 className="relative text-4xl font-extrabold leading-tight text-[#162113]">
                Bem-vinda à <span className="text-[#2D6A4F]">Talhão</span> 👋
              </h1>
            </div>

            <p className="mt-3 mb-8 text-sm leading-relaxed text-gray-500">
              Para personalizar sua experiência, nos diga qual é o seu perfil no
              setor agrícola.
            </p>

            <div className="space-y-2">
              {perfis.map((p, i) => {
                const selecionado = perfilIdx === i

                return (
                  <button
                    key={p.nome}
                    onClick={() => setPerfilIdx(i)}
                    className={`w-full cursor-pointer rounded-xl border px-5 py-4 text-left transition-all ${
                      selecionado
                        ? 'border-[#2D6A4F] bg-[#F0FDF4]'
                        : 'border-gray-200 hover:border-[#2D6A4F]/40 hover:bg-[#F0FDF4]/60'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{p.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-[#162113]">
                          {p.nome}
                        </p>
                        <p className="text-xs text-gray-400">{p.desc}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {perfilIdx === perfis.length - 1 && (
              <div className="mt-4">
                <label className="form-label">Qual é seu perfil?</label>
                <input
                  className="form-input"
                  placeholder="Ex: Agrônomo, Analista de Dados, etc"
                  value={outroPerfil}
                  onChange={(e) => setOutroPerfil(e.target.value)}
                />
              </div>
            )}

            <button
              onClick={handleContinuar}
              disabled={carregando || (perfilIdx === perfis.length - 1 && !outroPerfil)}
              className="mt-6 w-full rounded-xl bg-[#162113] py-4 text-base font-bold text-white transition-colors hover:bg-[#1f5230] disabled:opacity-40"
            >
              {carregando ? 'Salvando...' : 'Continuar →'}
            </button>

            <p className="mt-4 text-center text-xs text-gray-400">
              Você pode mudar isso depois nas configurações de perfil.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
