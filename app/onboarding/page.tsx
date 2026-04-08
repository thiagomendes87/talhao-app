'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const perfis = [
  { icon: '👨‍🌾', nome: 'Produtor Rural', desc: 'Uso próprio da propriedade' },
  { icon: '🧑‍💼', nome: 'Consultor Rural', desc: 'Consultoria agrícola' },
  { icon: '🏠', nome: 'Corretor / Imobiliária', desc: 'Compra e venda de imóveis' },
  { icon: '📈', nome: 'Investidor', desc: 'Compra de terra / Investimento' },
  { icon: '✏️', nome: 'Outro', desc: 'Especificar abaixo' },
]

export default function OnboardingPage() {
  const [perfilIdx, setPerfilIdx] = useState(0)
  const [outroPerfil, setOutroPerfil] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [usuario, setUsuario] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const verificarAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/entrar')
      } else {
        setUsuario(session.user)
      }
    }
    verificarAuth()
  }, [router])

  const handleContinuar = async () => {
    setCarregando(true)
    const perfilEscolhido = perfilIdx === perfis.length - 1 ? outroPerfil : perfis[perfilIdx].nome

    // Atualizar perfil do usuário
    const { error } = await supabase.auth.updateUser({
      data: { perfil: perfilEscolhido },
    })

    if (error) {
      console.error(error)
    } else {
      router.push('/dashboard')
    }
    setCarregando(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A2E] to-[#2D6A4F] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-12">

        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#2D6A4F] rounded-lg flex items-center justify-center text-lg">🌿</div>
          <span className="font-extrabold text-[#1A1A2E]">Talhão</span>
        </Link>

        <h1 className="text-3xl font-extrabold text-[#1A1A2E] mb-2">Bem-vindo!</h1>
        <p className="text-gray-600 mb-8">
          Para personalizar sua experiência, nos diga qual é o seu perfil no setor agrícola.
        </p>

        {/* Seletor de perfis */}
        <div className="space-y-3 mb-8">
          {perfis.map((p, i) => (
            <button
              key={p.nome}
              onClick={() => setPerfilIdx(i)}
              className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                perfilIdx === i ? 'border-[#2D6A4F] bg-[#F0FDF4]' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-3xl">{p.icon}</span>
              <div>
                <h3 className="font-bold text-[#1A1A2E]">{p.nome}</h3>
                <p className="text-sm text-gray-500">{p.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Campo "Outro" */}
        {perfilIdx === perfis.length - 1 && (
          <div className="mb-8">
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
          className="btn-primary w-full py-4 rounded-xl text-lg font-bold disabled:opacity-50"
        >
          {carregando ? 'Salvando...' : 'Continuar →'}
        </button>

        <p className="text-center text-xs text-gray-500 mt-6">
          Você pode mudar isso depois em suas configurações de perfil.
        </p>
      </div>
    </div>
  )
}
