import Link from "next/link";
import { ArrowRight, Zap, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between p-6 md:p-12">
      {/* Header */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-4 border-b border-zinc-900">
        <div className="flex items-center gap-2 font-bold text-xl text-white">
          <span className="bg-lime-400 text-black px-2 py-0.5 rounded font-black text-xs">
            DOCS
          </span>
          ProposalEngine
        </div>
        <Link
          href="/dashboard"
          className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs rounded-xl border border-zinc-700 transition-all"
        >
          Entrar
        </Link>
      </header>

      {/* Hero Section */}
      <main className="w-full max-w-3xl mx-auto text-center space-y-8 my-auto py-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime-400/10 border border-lime-400/20 text-lime-400 rounded-full text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          Assinatura Digital & Gestão de Propostas
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
          Feche contratos com <span className="text-lime-400">agilidade e validade jurídica</span>
        </h1>

        <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Envie propostas comerciais, receba assinaturas digitais direto no Canvas, registre auditoria de IP e gere PDFs autenticados em segundos.
        </p>

        <div className="pt-4 flex justify-center">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-8 py-4 bg-lime-400 hover:bg-lime-500 text-black font-bold rounded-xl transition-all shadow-lg shadow-lime-500/20 text-sm"
          >
            Acessar o Painel
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto text-center text-xs text-zinc-600 border-t border-zinc-900 pt-6 flex items-center justify-between">
        <p>ProposalEngine • Todos os direitos reservados.</p>
        <div className="flex items-center gap-1.5 text-zinc-500">
          <ShieldCheck className="w-4 h-4 text-lime-400" />
          <span>Ambiente Seguro</span>
        </div>
      </footer>
    </div>
  );
}