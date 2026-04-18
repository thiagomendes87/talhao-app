'use client'

import { useState } from 'react'
import Link from 'next/link'
import { buildAuthCallbackUrl, supabase } from '@/lib/supabase'

export default function CadastroPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregandoCadastro, setCarregandoCadastro] = useState(false)
  const [carregandoGoogle, setCarregandoGoogle] = useState(false)

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault()
    setErro('')
    setSucesso('')

    if (!nome.trim()) {
      setErro('Informe seu nome completo.')
      return
    }

    if (senha.length < 8) {
      setErro('A senha deve ter pelo menos 8 caracteres.')
      return
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não conferem.')
      return
    }

    setCarregandoCadastro(true)

    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: senha,
      options: {
        emailRedirectTo: buildAuthCallbackUrl('/mapa'),
        data: {
          full_name: nome.trim(),
        },
      },
    })

    if (error) {
      setErro(error.message)
      setCarregandoCadastro(false)
      return
    }

    setSucesso('Verifique seu email para confirmar o cadastro.')
    setCarregandoCadastro(false)
  }

  const handleGoogle = async () => {
    setErro('')
    setSucesso('')
    setCarregandoGoogle(true)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: buildAuthCallbackUrl('/mapa'),
      },
    })

    if (error) {
      setErro('Não foi possível iniciar o login com Google. Tente novamente.')
      setCarregandoGoogle(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7FAF8] px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-5xl items-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-[rgba(28,43,24,0.10)] bg-white shadow-[0_30px_80px_rgba(16,24,20,0.08)] lg:grid-cols-[1.05fr_0.95fr]">
          <div
            className="hidden lg:flex flex-col justify-between p-10"
            style={{ background: 'linear-gradient(145deg, #1B4332 0%, #2D6A4F 60%, #40916C 100%)' }}
          >
            <Link href="/" className="flex items-center gap-2 text-white">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-lg">🌿</div>
              <span className="text-xl font-extrabold">Talhão</span>
            </Link>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#B7E4C7]">Cadastro</p>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white">
                Crie sua conta e acesse o Talhão do seu jeito.
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-white/80">
                Cadastre-se com email e senha ou siga com Google. Depois da autenticação, você volta para o mapa.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-white/80">
              {[
                ['10M+', 'polígonos'],
                ['Google', 'login social'],
                ['1 clique', 'para abrir o mapa'],
              ].map(([valor, label]) => (
                <div key={label}>
                  <div className="text-2xl font-extrabold text-white">{valor}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em]">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1f5230] hover:text-[#162113] lg:hidden">
              <span className="text-base">←</span>
              Voltar para o início
            </Link>

            <div className="mt-4 lg:mt-0">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#5C7C6C]">Sua conta</p>
              <h2 className="mt-3 text-3xl font-extrabold text-[#162113]">Criar conta</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Use o formulário abaixo ou continue com Google.
              </p>
            </div>

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

            <form onSubmit={handleSignup} className="mt-8 space-y-4">
              <div>
                <label className="form-label">Nome</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Seu nome completo"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="voce@empresa.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label">Senha</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Mínimo de 8 caracteres"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label">Confirmar senha</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Repita sua senha"
                  value={confirmarSenha}
                  onChange={(event) => setConfirmarSenha(event.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={carregandoCadastro || carregandoGoogle}
                className="btn-primary w-full py-3 rounded-2xl text-base disabled:opacity-60"
              >
                {carregandoCadastro ? 'Criando conta...' : 'Criar conta'}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs text-gray-400">
              <div className="h-px flex-1 bg-gray-200" />
              ou
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              disabled={carregandoCadastro || carregandoGoogle}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[rgba(22,33,19,0.12)] px-4 py-3 text-sm font-semibold text-[#162113] transition-colors hover:bg-gray-50 disabled:opacity-60"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {carregandoGoogle ? 'Redirecionando...' : 'Continuar com Google'}
            </button>

            <p className="mt-6 text-center text-sm text-gray-600">
              Já tenho conta?{' '}
              <Link href="/entrar" className="font-semibold text-[#1f5230] hover:text-[#162113]">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
