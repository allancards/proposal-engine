"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { createProposalAction } from "@/actions/proposal-actions";
import { Client } from "@prisma/client";
import { useState } from "react";
import { Loader2, PlusCircle } from "lucide-react";
import { useAuth } from '@clerk/nextjs'

// Mesmo esquema usado na Server Action
const proposalSchema = z.object({
  clientId: z.string().min(1, "Selecione um cliente"),
  title: z.string().min(3, "Título muito curto"),
  description: z.string().min(10, "Descreva melhor o escopo"),
  amount: z.number().positive({message: "O valor deve ser maior que zero"}),
  expiresAt: z.string().min(1, "Defina uma data de expiração"),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

export function ProposalForm({ clients }: { clients: Client[] }) {
  const { userId } = useAuth()
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProposalFormData, any, ProposalFormData>({
      resolver: zodResolver(proposalSchema),
    });

  async function onSubmit(data: ProposalFormData) {
    setIsSubmitting(true);
    setErrorMessage("");

            // Nota: Em produção, o userId viria da sessão (Clerk/NextAuth)
    const result = await createProposalAction({
      userId: userId || "user_default_id",
      clientId: data.clientId,
      title: data.title,
      description: data.description,
      amount: Number(data.amount),
      expiresAt: new Date(data.expiresAt),
    });

    if (result.success) {
      router.push(`/proposals/${result.data?.id}`);
    } else {
      setErrorMessage(result.error || "Erro ao salvar proposta");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMessage && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Seleção de Cliente */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Cliente</label>
          <select
            {...register("clientId")}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-lime-500/50 outline-none transition-all"
          >
            <option value="">Selecione um cliente...</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.company ? `(${c.company})` : ""}
              </option>
            ))}
          </select>
          {errors.clientId && <p className="text-xs text-red-500">{errors.clientId.message}</p>}
        </div>  

        {/* Valor da Proposta */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Valor (R$)</label>
          <input
            type="number"
            step="0.1"
            placeholder="0,00"
            {...register("amount", { valueAsNumber: true })}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-lime-500/50 outline-none transition-all"
          />
          {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
        </div>
      </div>

      {/* Título */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">Título da Proposta</label>
        <input
          placeholder="Ex: Identidade Visual e Logotipo"
          {...register("title")}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-lime-500/50 outline-none transition-all"
        />
        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
      </div>

      {/* Descrição / Escopo */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">Descrição do Escopo</label>
        <textarea
          rows={5}
          placeholder="Descreva detalhadamente o que será entregue..."
          {...register("description")}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-lime-500/50 outline-none transition-all resize-none"
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>

      {/* Data de Expiração */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">Válido até</label>
        <input
          type="date"
          {...register("expiresAt")}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-lime-500/50 outline-none transition-all"
        />
        {errors.expiresAt && <p className="text-xs text-red-500">{errors.expiresAt.message}</p>}
      </div>

      <div className="pt-4 flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-8 py-2.5 bg-lime-400 hover:bg-lime-500 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-lime-500/20"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              Salvar Rascunho
            </>
          )}
        </button>
      </div>
    </form>
  );
}