import React from "react";

export default function PublicProposalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-between p-4 md:p-10">
      <header className="w-full max-w-4xl flex justify-between items-center py-4 border-b border-zinc-800">
        <div className="flex items-center gap-2 font-bold text-lg text-white">
          <span className="bg-lime-400 text-black px-2 py-0.5 rounded font-black text-xs">
            DOCS
          </span>
          ProposalEngine
        </div>
        <span className="text-xs text-zinc-500 font-mono">
          Documento Seguro & Criptografado
        </span>
      </header>

      <main className="w-full max-w-4xl my-8">{children}</main>

      <footer className="w-full max-w-4xl text-center text-xs text-zinc-600 border-t border-zinc-900 pt-6">
        Assinatura Digital Segura • Validade Jurídica Garantida
      </footer>
    </div>
  );
}