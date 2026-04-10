'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const perfis = [
  { icon: '👨‍🌾', nome: 'Produtor Rural', desc: 'Uso próprio da propriedade' },
  { icon: '🧑‍💼', nome: 'Consultor Rural', desc: 'Consultoria agrícola' },
  { icon: '🏠', nome: 'Corretor / Imobiliária', desc: 'Compra e venda de imóveis' },
  { icon: '📈', nome: 'Investidor', desc: 'Compra de terra / Investimento' },
  { icon: '✏️', nome: 'Outro', desc: 'Especificar abaixo' },
]

export default function CadastroPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [perfilIdx, setPerfilIdx] = useState(0)
  const [outroPerfil, setOutroPerfil] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [emailEnviado, setEmailEnviado] = useState(false)
  const router = useRouter()

  const validarSenha = (s: string) => s.length >= 8 && /[A-Z]/.test(s) && /[0-9]/.test(s)
  const perfilEscolhido = perfilIdx === perfis.length - 1 ? outroPerfil : perfis[perfilIdx].nome

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)
    setErro('')

    if (!validarSenha(senha)) {
      setErro('Senha: mín. 8 caracteres, 1 maiúscula e 1 número')
      setCarregando(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { full_name: nome, perfil: perfilEscolhido } },
    })

    if (error) {
      setErro(error.message)
      setCarregando(false)
    } else {
      setEmailEnviado(true)
      setCarregando(false)
    }
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
    })
  }

  return (
    <div className="min-h-screen grid grid-cols-2">
      {/* Esquerda */}
      <div
        className="flex flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #1A1A2E 0%, #2D6A4F 100%)' }}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center text-lg">🌿</div>
          <span className="text-white font-extrabold text-xl">Talhão</span>
        </Link>
        <div>
          <h2 className="text-white text-3xl font-extrabold leading-tight mb-4">Comece a explorar o Brasil rural.</h2>
          <p className="text-white/70 text-base leading-relaxed mb-8">
            Crie sua conta em menos de 2 minutos. Grátis para começar, sem cartão de crédito.
          </p>
          <div className="space-y-3">
            {['Navegue pelas fazendas gratuitamente', 'Acesso a todos os polígonos do SICAR, SIGEF, SNCI', 'Busca por CAR, nome, município', 'Sem cartão de crédito'].map(item => (
              <div key={item} className="flex items-center gap-3 text-white/90 text-base">
                <span className="text-xl">✅</span> {item}
              </div>
            ))}
          </div>
        </div>
        <div />
      </div>

      {/* Direita */}
      <div className="flex flex-col justify-center px-12 py-8 bg-white overflow-y-auto">

        {/* Tela de email enviado */}
        {emailEnviado ? (
          <div className="text-center space-y-4">
            <div className="text-6xl">📬</div>
            <h2 className="text-2xl font-extrabold text-[#1A1A2E]">Confirme seu email!</h2>
            <p className="text-gray-600">
              Enviamos um link de confirmação para <strong>{email}</strong>.
            </p>
            <p className="text-sm text-gray-500">
              Clique no link que chegou na sua caixa de entrada para ativar sua conta e acessar o Talhão.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              Não recebeu? Verifique sua pasta de spam ou{' '}
              <button onClick={() => setEmailEnviado(false)} className="underline font-semibold">tente novamente</button>.
            </div>
            <Link href="/entrar" className="block text-[#2D6A4F] font-semibold text-sm hover:underline">
              Já confirmei → Entrar
            </Link>
          </div>
        ) : (
          <>
        <h1 className="text-2xl font-extrabold text-[#1A1A2E] mb-1">Criar conta grátis</h1>
        <p className="text-sm text-gray-600 mb-5">
          Já tem conta? <Link href="/entrar" className="text-[#2D6A4F] font-semibold">Entrar</Link>
        </p>

        {/* Login Social */}
        <div className="mb-5">
          <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Cadastrar com Google
          </button>
        </div>

        <div className="flex items-center gap-3 mb-5 text-xs text-gray-400">
          <div className="flex-1 h-px bg-gray-200" />ou preencha os dados<div className="flex-1 h-px bg-gray-200" />
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {erro && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{erro}</div>}

          <div>
            <label className="form-label">Nome completo</label>
            <input className="form-input" placeholder="João Silva" value={nome} onChange={e => setNome(e.target.value)} required />
          </div>
          <div>
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="seu@email.com.br" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="form-label">Senha</label>
            <input className="form-input" type="password" placeholder="Mín. 8 caracteres, 1 maiúscula, 1 número" value={senha} onChange={e => setSenha(e.target.value)} required />
            {senha && (
              <p className={`text-xs mt-1 ${validarSenha(senha) ? 'text-green-600' : 'text-red-500'}`}>
                {validarSenha(senha) ? '✅ Senha forte' : '❌ Mín. 8 caracteres, 1 maiúscula e 1 número'}
              </p>
            )}
          </div>

          {/* Perfil de uso */}
          <div>
            <label className="form-label">Perfil de uso</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {perfis.map((p, i) => (
                <button key={p.nome} type="button" onClick={() => setPerfilIdx(i)}
                  className={`border-2 rounded-xl p-3 text-left transition-colors ${perfilIdx === i ? 'border-[#1A1A2E] bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="font-bold text-[#1A1A2E] text-sm">{p.icon} {p.nome}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{p.desc}</div>
                </button>
              ))}
            </div>
            {perfilIdx === perfis.length - 1 && (
              <input className="form-input mt-2" placeholder="Ex: Agrônomo, Analista, etc" value={outroPerfil} onChange={e => setOutroPerfil(e.target.value)} />
            )}
          </div>

          <button type="submit" disabled={carregando || !validarSenha(senha)}
            className="btn-primary w-full py-3 rounded-xl text-base font-bold disabled:opacity-50">
            {carregando ? 'Criando conta...' : 'Criar conta grátis →'}
          </button>

          <p className="text-center text-xs text-gray-400">
            Ao criar conta você concorda com os <Link href="#" className="text-[#2D6A4F]">Termos de Uso</Link> e <Link href="#" className="text-[#2D6A4F]">Política de Privacidade</Link>.
          </p>
        </form>
        </>
        )}
      </div>
    </div>
  )
}
