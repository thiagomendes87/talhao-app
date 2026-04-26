'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
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
    <div className="h-screen overflow-hidden bg-white">
      <div className="grid h-full grid-cols-1 bg-white lg:grid-cols-2">
        <section className="relative flex h-full flex-col justify-center overflow-hidden bg-white px-6 py-10 lg:px-16 lg:py-12">
          <div className="glow-green-strong" />
          <div className="relative z-10 mx-auto w-full max-w-xl">
            <div className="inline-flex rounded-full border border-[#D8F3DC] bg-[#F0FDF4] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#2D6A4F]">
              Cadastro
            </div>
            <div className="mt-2 mb-6 h-0.5 w-8 bg-[#2D6A4F]" />

            <h1 className="flex flex-wrap items-center gap-3 text-4xl font-extrabold leading-tight text-[#162113]">
              Crie sua conta na
              <img
                src="/logo-oficial.png"
                alt="Talhão"
                className="inline-block h-12 w-12 rounded-xl object-contain align-middle"
              />
            </h1>
            <p className="mt-3 mb-8 text-sm leading-relaxed text-gray-500">
              Use o formulário abaixo ou continue com Google.
            </p>

            {erro && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {erro}
              </div>
            )}

            {sucesso && (
              <div className="mb-6 rounded-2xl border border-[#D8E9DE] bg-[#F3FBF6] px-4 py-3 text-sm text-[#24503B]">
                {sucesso}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
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
                className="btn-primary w-full rounded-2xl py-3 text-base disabled:opacity-60"
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
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-[rgba(22,33,19,0.12)] bg-white px-4 py-4 text-sm font-semibold text-[#162113] shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-60"
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
              <Link
                href="/entrar"
                className="font-semibold text-[#2D6A4F] hover:text-[#162113]"
              >
                Entrar
              </Link>
            </p>
          </div>
        </section>

        <section className="relative hidden h-full overflow-hidden lg:flex">
          <Image
            src="/foto-lp3.png"
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
                <p className="text-xl font-semibold leading-relaxed text-white">
                  &ldquo;Acesse dados de qualquer fazenda do Brasil em segundos —
                  diretamente do satélite.&rdquo;
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
      </div>
    </div>
  )
}
