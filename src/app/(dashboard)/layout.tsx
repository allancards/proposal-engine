import React from 'react'

interface NewProposalLayoutProps {
  children: React.ReactNode
}

// O "export default" é a peça chave que o Next.js estava procurando
export default function NewProposalLayout({ children }: NewProposalLayoutProps) {
  return (
    <div className="new-proposal-container">
      {/* Você pode adicionar elementos fixos aqui, como uma barra lateral ou título */}
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Criar Nova Proposta</h1>
      </header>
      
      {/* O Next.js injeta a página (page.tsx) dentro do "children" */}
      <main>{children}</main>
    </div>
  )
}
