import { prisma } from "@/lib/prisma";
import { ProposalForm } from "@/components/dashboard/ProposalForm";

export default async function NewProposalPage() {
  // Busca clientes do usuário logado (usando um ID fixo por enquanto até configurar Auth)
  const clients = await prisma.client.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-10 px-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Criar Nova Proposta</h1>
        <p className="text-zinc-400 mt-2">
          Preencha os detalhes abaixo para gerar um rascunho de contrato.
        </p>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl shadow-xl">
        <ProposalForm clients={clients} />
      </div>
    </div>
  );
}