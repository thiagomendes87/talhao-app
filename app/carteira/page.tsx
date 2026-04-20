'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { buildLoginPath, supabase } from '@/lib/supabase'

type Transacao = {
  id: string
  tipo: 'recarga' | 'gasto'
  descricao: string
  creditos: number   // + recarga, - gasto
  data: string
}

export default function CarteiraPage() {
  const [usuario, setUsuario] = useState<any>(null)
  const [creditos, setCreditos] = useState(0)
  const [extrato, setExtrato] = useState<Transacao[]>([])
  const [carregando, setCarregando] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace(buildLoginPath('/carteira', 'Entre com sua conta para acessar sua carteira.'))
        return
      }
      setUsuario(session.user)

      // Saldo atual
      const { data: carteira } = await supabase
        .from('carteira')
        .select('creditos')
        .eq('user_id', session.user.id)
        .single()
      setCreditos(carteira?.creditos ?? 0)

      // Recargas (pagamentos aprovados)
      const { data: pagamentos } = await supabase
        .from('payments')
        .select('id, quantidade_creditos, amount, created_at, payment_method')
        .eq('user_id', session.user.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(100)

      // Gastos (downloads)
      const { data: downloads } = await supabase
        .from('downloads')
        .select('id, tipo_arquivo, codigo_imovel, source, creditos_usados, criado_em')
        .eq('user_id', session.user.id)
        .order('criado_em', { ascending: false })
        .limit(100)

      const recargas: Transacao[] = (pagamentos ?? []).map((p) => ({
        id: p.id,
        tipo: 'recarga',
        descricao: `Recarga · ${p.quantidade_creditos} crédito${p.quantidade_creditos !== 1 ? 's' : ''}`,
        creditos: p.quantidade_creditos ?? 0,
        data: p.created_at,
      }))

      const gastos: Transacao[] = (downloads ?? []).map((d) => ({
        id: d.id,
        tipo: 'gasto',
        descricao: d.codigo_imovel
          ? `Download ${d.tipo_arquivo ?? ''} · ${d.codigo_imovel}`
          : `Download ${d.tipo_arquivo ?? ''}`,
        creditos: -(d.creditos_usados ?? 1),
        data: d.criado_em,
      }))

      const todos = [...recargas, ...gastos].sort(
        (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
      )
      setExtrato(todos)
      setCarregando(false)
    }
    init()
  }, [router])

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!usuario) return null

  const nomeUsuario =
    usuario?.user_metadata?.full_name?.split(' ')[0] || 'Usuário'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 pt-8 pb-8 px-4 sm:px-10">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link
              href="/dashboard"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1 mb-2"
            >
              ← Dashboard
            </Link>
            <h1 className="text-xl font-bold text-[#162113]">Carteira</h1>
            <p className="text-sm text-gray-500 mt-0.5">Olá, {nomeUsuario}</p>
          </div>
          <Link
            href="/assinar?tab=downloads"
            className="bg-[#1f5230] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#2a6b3f] transition-all whitespace-nowrap text-sm"
          >
            + Comprar créditos
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4 sm:px-10 space-y-6">
        {/* Saldo */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Saldo disponível</p>
            <p className="text-4xl font-extrabold text-[#1A1A2E]">{creditos}</p>
            <p className="text-sm text-gray-500 mt-1">
              créditos · R$ {(creditos * 3.5).toFixed(2)}
            </p>
          </div>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(31,82,48,0.08)' }}
          >
            <svg
              className="w-8 h-8 text-[#1f5230]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Extrato */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
          <h2 className="text-base font-extrabold text-[#1A1A2E] mb-4">
            Extrato
          </h2>

          {extrato.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <svg
                className="w-10 h-10 mx-auto mb-3 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-sm">Nenhuma movimentação ainda.</p>
              <p className="text-xs mt-1">
                Compre créditos ou faça um download para ver o extrato aqui.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {extrato.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-3.5 gap-3"
                >
                  {/* Ícone */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      tx.tipo === 'recarga'
                        ? 'bg-green-50'
                        : 'bg-gray-100'
                    }`}
                  >
                    {tx.tipo === 'recarga' ? (
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Descrição + data */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1A1A2E] truncate">
                      {tx.descricao}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(tx.data).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Valor */}
                  <span
                    className={`text-sm font-bold shrink-0 ${
                      tx.tipo === 'recarga'
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {tx.tipo === 'recarga' ? '+' : ''}{tx.creditos} crédito
                    {Math.abs(tx.creditos) !== 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
