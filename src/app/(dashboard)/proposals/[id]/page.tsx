import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SendProposalButton } from "@/components/dashboard/SendProposalButton";
import { Clock, User, DollarSign, Calendar } from "lucide-react";

const statusBadges: Record<string, { label: string; bg: string; text: string }> = {
  DRAFT: { label: "Rascunho", bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-400" },
  SENT: { label: "Enviado", bg: "bg-blue-500/10 border-blue-500/20", text: "text-blue-400" },
  VIEWED: { label: "Visualizado", bg: "bg-purple-500/10 border-purple-500/20", text: "text-purple-400" },
  SIGNED: { label: "Assinado", bg: "bg-lime-500/10 border-lime-500/20", text: "text-lime-400" },
  EXPIRED: { label: "Expirado", bg: "bg-red-500/10 border-red-500/20", text: "text-red-400" },
};

export default async function ProposalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const proposal = await prisma.proposal.findUnique({
    where: { id: resolvedParams.id },
    include: { client: true, audit: true },
  });


  if (!proposal) {
    notFound();
  }


  
  
  
  const badge = statusBadges[proposal.status] || statusBadges.DRAFT;
  const isLocked = proposal.status !== "DRAFT";

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-10 px-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">{proposal.title}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${badge.bg} ${badge.text}`}>
              {badge.label}
            </span>
          </div>
          <p className="text-zinc-400 mt-1 text-sm">ID: {proposal.id}</p>
        </div>

        <SendProposalButton 
          proposalId={proposal.id} 
          token={proposal.token} 
          status={proposal.status} 
        />
      </div>

      {/* Grid de Informações Chave */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex items-center gap-3">
          <User className="w-8 h-8 text-lime-400 p-1.5 bg-lime-400/10 rounded-lg" />
          <div>
            <p className="text-xs text-zinc-400">Cliente</p>
            <p className="text-sm font-semibold text-white">{proposal.client.name}</p>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-lime-400 p-1.5 bg-lime-400/10 rounded-lg" />
          <div>
            <p className="text-xs text-zinc-400">Valor Total</p>
            <p className="text-sm font-semibold text-white">
              R$ {Number(proposal.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex items-center gap-3">
          <Calendar className="w-8 h-8 text-lime-400 p-1.5 bg-lime-400/10 rounded-lg" />
          <div>
            <p className="text-xs text-zinc-400">Válido Até</p>
            <p className="text-sm font-semibold text-white">
              {new Date(proposal.expiresAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>
      </div>

      {/* Conteúdo / Escopo da Proposta */}
      <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-4">
        <h2 className="text-lg font-bold text-white">Escopo dos Serviços</h2>
        {isLocked && (
          <div className="p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-xs text-zinc-400 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            Esta proposta foi congelada no envio e não pode mais ser editada.
          </div>
        )}
        <div className="text-zinc-300 whitespace-pre-line leading-relaxed text-sm">
          {proposal.description}
        </div>
      </div>
    </div>
  );
}