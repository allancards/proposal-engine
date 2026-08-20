'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { createClientAction } from '@/actions/client-actions'
import { Plus, Loader2 } from 'lucide-react'

export function CreateClientDialog() {
  const { userId } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    // Impede novas execuções se o envio já estiver em andamento
    if (loading) return 
    e.preventDefault()

    if (!userId) {
      setError('Sessão expirada. Faça login novamente.')
      return
    }

    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: (formData.get('phone') as string) || undefined,
      company: (formData.get('company') as string) || undefined,
    }

    const result = await createClientAction(userId, data)
    setLoading(false)

    if (!result.success) {
      setError(result.error ?? '')
      return
    }

    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-lime-400 hover:bg-lime-500 text-black font-bold rounded-xl text-xs transition-all shadow-lg shadow-lime-500/10"
      >
        <Plus className="w-4 h-4" />
        Novo Cliente
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
          <h2 className="text-base font-bold text-white">Cadastrar Cliente</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-zinc-500 hover:text-zinc-300 text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Nome *</label>
            <input
              name="name"
              required
              placeholder="Ex: Ana Silva"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1">E-mail *</label>
            <input
              name="email"
              type="email"
              required
              placeholder="ana@empresa.com"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Telefone</label>
              <input
                name="phone"
                placeholder="(11) 99999-9999"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Empresa</label>
              <input
                name="company"
                placeholder="Tech Ltd"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl text-xs transition-all"
            >
              Cancelar
            </button>
            <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-lime-400 hover:bg-lime-500 text-black font-bold rounded-xl text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {loading ? (
                    <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Salvando...
                    </>
                ) : (
                    'Salvar'
                )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}