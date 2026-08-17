"use client";

import { useState } from "react";
import { SignatureModal } from "./SignatureModal";
import { CheckCircle2, AlertCircle, FileCheck } from "lucide-react";

export function ClientPublicView({ proposal }: { proposal: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isSigned = proposal.status === "SIGNED";
  const isExpired =
    proposal.status === "EXPIRED" || new Date() > new Date(proposal.expiresAt);

  return (
    <div className="space-y-8">
      {/* Banner de Status */}
      {isSigned ? (
        <div className="p-4 bg-lime-500/10 border border-lime-500/30 rounded-2xl flex items-center gap-3 text-lime-400 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-bold">Contrato Assinado com Sucesso!</p>
            <p className="text-xs text-lime-400/80">
              Assinado por {proposal.audit?.signerName} em{" "}
              {new Date(proposal.audit?.signedAt).toLocaleString("pt-BR")}.
            </p>
          </div>
        </div>
      ) : isExpired ? (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-bold">Proposta Expirada</p>
            <p className="text-xs text-red-400/80">
              O prazo de validade desta proposta expirou e ela não aceita mais assinaturas.
            </p>
          </div>
        </div>
      ) : null}

      {/* Cartão do Documento */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6 shadow-2xl">
        <div className="flex justify-between items-start border-b border-zinc-800 pb-6">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
              Proposta Comercial
            </p>
            <h1 className="text-2xl font-bold text-white mt-1">{proposal.title}</h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500">Valor Proposto</p>
            <p className="text-xl font-bold text-lime-400 mt-1">
              R$ {Number(proposal.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Partes Envolvidas */}
        <div className="grid grid-cols-2 gap-4 bg-zinc-950/50 p-4 rounded-xl text-xs border border-zinc-800/50">
          <div>
            <p className="text-zinc-500">Contratante (Cliente):</p>
            <p className="font-semibold text-zinc-200 mt-0.5">{proposal.client.name}</p>
            <p className="text-zinc-400">{proposal.client.email}</p>
          </div>
          <div>
            <p className="text-zinc-500">Prestador de Serviço:</p>
            <p className="font-semibold text-zinc-200 mt-0.5">{proposal.user.name}</p>
            <p className="text-zinc-400">{proposal.user.email}</p>
          </div>
        </div>

        {/* Escopo */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-zinc-300">Escopo dos Serviços</h3>
          <p className="text-sm text-zinc-400 whitespace-pre-line leading-relaxed">
            {proposal.description}
          </p>
        </div>

        {/* Auditoria se já assinado */}
        {isSigned && proposal.audit && (
          <div className="pt-6 border-t border-zinc-800 space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Carimbo de Validade Jurídica
            </h3>
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between">
              <div className="space-y-1 text-xs">
                <p className="text-zinc-300">
                  <strong>IP Registrado:</strong> {proposal.audit.ipAddress}
                </p>
                <p className="text-zinc-300">
                  <strong>Navegador:</strong> {proposal.audit.userAgent}
                </p>
              </div>
              {proposal.audit.signatureImageUrl && (
                <div className="bg-white/10 p-2 rounded-lg border border-zinc-700">
                  <img
                    src={proposal.audit.signatureImageUrl}
                    alt="Assinatura"
                    className="h-12 object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Botão de Ação */}
        {!isSigned && !isExpired && (
          <div className="pt-6 border-t border-zinc-800 flex justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-8 py-3 bg-lime-400 hover:bg-lime-500 text-black font-bold rounded-xl transition-all shadow-lg shadow-lime-500/10"
            >
              <FileCheck className="w-5 h-5" />
              Assinar Contrato
            </button>
          </div>
        )}
      </div>

      <SignatureModal
        token={proposal.token}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}