'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppTopbar from '@/components/AppTopbar'
import { buildLoginPath, supabase } from '@/lib/supabase'

const perfis = [
  'Produtor Rural',
  'Consultor Rural',
  'Corretor / Imobiliária',
  'Investidor',
  'Outro',
]

export default function ContaPage() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<any>(null)
  const [nomeCompleto, setNomeCompleto] = useState('')
  const [perfil, setPerfil] = useState('Produtor Rural')
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [saindo, setSaindo] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  useEffect(() => {
    let active = true

    const carregarConta = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!active) {
        return
      }

      if (!session) {
        router.replace(
          buildLoginPath('/conta', 'Entre com sua conta Google para acessar sua conta.')
        )
        return
      }

      const user = session.user
      setUsuario(user)
      setNomeCompleto(user.user_metadata?.full_name || '')

      const perfilAtual = user.user_metadata?.perfil
      setPerfil(perfis.includes(perfilAtual) ? perfilAtual : 'Outro')
      setCarregando(false)
    }

    carregarConta()

    return () => {
      active = false
    }
  }, [router])

  const handleSalvar = async () => {
    if (!usuario) {
      return
    }

    const nome = nomeCompleto.trim()

    if (!nome) {
      setErro('Informe seu nome completo.')
      setSucesso('')
      return
    }

    setSalvando(true)
    setErro('')
    setSucesso('')

    const { data, error } = await supabase.auth.updateUser({
      data: {
        ...usuario.user_metadata,
        full_name: nome,
        perfil,
      },
    })

    if (error) {
      setErro('Não foi possível salvar suas alterações.')
      setSalvando(false)
      return
    }

    const { error: perfilError } = await supabase
      .from('perfis')
      .upsert({ id: usuario.id, perfil }, { onConflict: 'id' })

    if (perfilError) {
      setErro('Seu perfil foi atualizado parcialmente. Tente salvar novamente.')
      setSalvando(false)
      return
    }

    if (data.user) {
      setUsuario(data.user)
    }

    setSucesso('Alterações salvas com sucesso.')
    setSalvando(false)
  }

  const handleSignOut = async () => {
    setSaindo(true)
    await supabase.auth.signOut()
    router.replace('/')
  }

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7FAF8]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!usuario) return null

  return (
    <div className="min-h-screen bg-[#F7FAF8]">
      <AppTopbar />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-10 sm:py-10">
        <section className="rounded-[28px] border border-[rgba(28,43,24,0.08)] bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#5C7C6C]">Conta</p>
          <h1 className="mt-2 text-3xl font-extrabold text-[#162113]">Meu perfil</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600">
            Atualize seus dados principais e mantenha seu perfil alinhado com o uso que você faz do Talhão.
          </p>

          {erro && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {erro}
            </div>
          )}

          {sucesso && (
            <div className="mt-6 rounded-2xl border border-[#D8E9DE] bg-[#F3FBF6] px-4 py-3 text-sm text-[#24503B]">
              {sucesso}
            </div>
          )}

          <div className="mt-8 grid gap-5">
            <div>
              <label className="form-label">Nome completo</label>
              <input
                className="form-input"
                value={nomeCompleto}
                onChange={(event) => setNomeCompleto(event.target.value)}
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label className="form-label">Email</label>
              <input
                className="form-input bg-gray-50 text-gray-500"
                value={usuario.email || ''}
                readOnly
              />
            </div>

            <div>
              <label className="form-label">Tipo de perfil</label>
              <select
                className="form-input"
                value={perfil}
                onChange={(event) => setPerfil(event.target.value)}
              >
                {perfis.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <button
                type="button"
                onClick={handleSalvar}
                disabled={salvando}
                className="rounded-xl bg-[#1f5230] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#163b23] disabled:opacity-60"
              >
                {salvando ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[28px] border border-[rgba(28,43,24,0.08)] bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#5C7C6C]">Minha conta</p>
          <h2 className="mt-2 text-2xl font-extrabold text-[#162113]">Sessão e acesso</h2>
          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-500">Email Google associado</p>
            <p className="mt-2 text-base font-semibold text-[#162113]">{usuario.email}</p>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleSignOut}
              disabled={saindo}
              className="rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
            >
              {saindo ? 'Saindo...' : 'Sair da conta'}
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
