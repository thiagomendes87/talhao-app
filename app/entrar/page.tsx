'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)
    setErro('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      })

      if (error) {
        setErro(error.message)
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setErro('Erro ao entrar. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-2">
      {/* Esquerda — visual */}
      <div className="flex flex-col justify-between p-12" style={{ background: 'linear-gradient(145deg, #1A1A2E 0%, #2D6A4F 100%)' }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center text-lg">🌿</div>
          <span className="text-white font-extrabold text-xl">Talhão</span>
        </Link>
        <div>
          <h2 className="text-white text-3xl font-extrabold leading-tight mb-4">Bem-vindo de volta.</h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Acesse o maior acervo de polígonos rurais do Brasil. Navegue, busque e baixe com facilidade.
          </p>
        </div>
        <div className="flex gap-8">
          {[['10M+', 'Polígonos CAR'], ['27', 'Estados cobertos'], ['100%', 'Cobertura nacional']].map(([n, l]) => (
            <div key={l}>
              <div className="text-white text-3xl font-extrabold">{n}</div>
              <div className="text-white/60 text-xs mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Direita — formulário */}
      <div className="flex flex-col justify-center px-12 py-10 bg-white">
        <h1 className="text-2xl font-extrabold text-[#1A1A2E] mb-1.5">Entrar na conta</h1>
        <p className="text-sm text-gray-600 mb-8">
          Não tem uma conta?{' '}
          <Link href="/cadastro" className="text-[#2D6A4F] font-semibold">Cadastre-se grátis</Link>
        </p>

        {/* Login Social */}
        <div className="space-y-3 mb-5">
          <button type="button" onClick={async () => { await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/dashboard` } }) }}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Entrar com Google
          </button>
          <button type="button" onClick={async () => { await supabase.auth.signInWithOAuth({ provider: 'facebook', options: { redirectTo: `${window.location.origin}/dashboard` } }) }}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Entrar com Facebook
          </button>
        </div>

        <div className="flex items-center gap-3 mb-5 text-xs text-gray-400">
          <div className="flex-1 h-px bg-gray-200" />ou entre com email<div className="flex-1 h-px bg-gray-200" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {erro}
            </div>
          )}

          <div>
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="seu@email.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">Senha</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="btn-primary w-full py-3 rounded-xl text-base font-bold disabled:opacity-50"
          >
            {carregando ? 'Entrando...' : 'Entrar →'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Não tem conta?{' '}
          <Link href="/cadastro" className="text-[#2D6A4F] font-semibold">Criar conta grátis</Link>
        </p>
      </div>
    </div>
  )
}
