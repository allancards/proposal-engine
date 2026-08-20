export const dynamic = 'force-dynamic'

import Link from "next/link";
import { UserButton } from '@clerk/nextjs'
import {auth} from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma";
import { ProposalStatus } from "@prisma/client";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { DownloadPdfButton } from "@/components/dashboard/DownloadPdfButton";
import {CreateClientDialog} from "@/components/createClient/create-client-dialog";
import { 
  Plus, 
  DollarSign, 
  FileText, 
  TrendingUp, 
  Clock, 
  ExternalLink 
} from "lucide-react";

export const revalidate = 0; // Garante dados sempre frescos ao carregar

export default async function DashboardPage() {
  const { userId } = await auth()
  const proposals = await prisma.proposal.findMany({
    include: { client: true, audit: true },
    orderBy: { createdAt: "desc" },
  });

  // Cálculo das Métricas (KPIs)
  const totalProposals = proposals.length;
  
  const signedProposals = proposals.filter(
    (p) => p.status === ProposalStatus.SIGNED
  );

  const pendingProposals = proposals.filter((p) =>
  // Força o array a aceitar o tipo mais amplo do Enum
  ([ProposalStatus.SENT, ProposalStatus.VIEWED] as ProposalStatus[]).includes(p.status)
);

  const totalRevenue = signedProposals.reduce(
    (acc, p) => acc + Number(p.amount),
    0
  );

  const conversionRate =
    totalProposals > 0
      ? ((signedProposals.length / totalProposals) * 100).toFixed(0)
      : "0";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Acompanhe a conversão de contratos e propostas em tempo real.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">

        <div className="flex items-center gap-4 ">
          <UserButton />
        </div>
        <Link
          href="/proposals/new"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-lime-400 hover:bg-lime-500 text-black font-bold text-xs rounded-xl transition-all shadow-lg shadow-lime-500/10"
          >
          <Plus className="w-4 h-4" />
          Nova Proposta
        </Link>
        <CreateClientDialog />
            </div>
      </div>

      {/* Grid de Métricas (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Faturamento Assinado</span>
            <DollarSign className="w-4 h-4 text-lime-400" />
          </div>
          <p className="text-2xl font-black text-white">
            R$ {totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Taxa de Conversão</span>
            <TrendingUp className="w-4 h-4 text-lime-400" />
          </div>
          <p className="text-2xl font-black text-white">{conversionRate}%</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Pendentes de Assinatura</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">{pendingProposals.length}</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total de Propostas</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white">{totalProposals}</p>
        </div>
      </div>

      {/* Tabela de Propostas */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-white">Propostas Recentes</h2>
        </div>

        {proposals.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-zinc-500 text-sm">Nenhuma proposta criada até o momento.</p>
            <Link
              href="/proposals/new"
              className="inline-block text-xs text-lime-400 font-semibold hover:underline"
            >
              Criar a primeira proposta →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950/50 text-zinc-400 uppercase tracking-wider font-semibold border-b border-zinc-800">
                <tr>
                  <th className="p-4">Título / Cliente</th>
                  <th className="p-4">Valor</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Criada em</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {proposals.map((proposal) => (
                  <tr key={proposal.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-white">{proposal.title}</p>
                      <p className="text-zinc-500">{proposal.client.name} ({proposal.client.email})</p>
                    </td>
                    <td className="p-4 font-bold text-white">
                      R$ {Number(proposal.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={proposal.status} />
                    </td>
                    <td className="p-4 text-zinc-500">
                      {new Date(proposal.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Link Público */}
                        <a
                          href={`/p/${proposal.token}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Abrir visão do cliente"
                          className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        {/* Botão de PDF */}
                        <DownloadPdfButton proposalId={proposal.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}