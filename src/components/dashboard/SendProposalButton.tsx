"use client";

import { useState, useEffect } from "react";
import { sendProposalAction } from "@/actions/proposal-actions";
import { Send, Check, Copy, Loader2 } from "lucide-react";

interface SendProposalButtonProps {
  proposalId: string;
  token: string;
  status: string;
}

export function SendProposalButton({ proposalId, token, status }: SendProposalButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [publicUrl, setPublicUrl] = useState("");

  useEffect(() => {
    setPublicUrl(`${window.location.origin}/p/${token}`);
  }, [token]);

  

  async function handleSend() {
    setIsLoading(true);
    await sendProposalAction(proposalId);
    setIsLoading(false);
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Se já foi enviada ou visualizada, mostra o link público para copiar
  if (status !== "DRAFT") {
    return (
      <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
        <span className="text-xs text-zinc-400 font-mono truncate max-w-[250px]">
          {publicUrl}
        </span>
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-lime-400" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copiar Link
            </>
          )}
        </button>
      </div>
    );
  }

  // Se ainda estiver em RASCUNHO (DRAFT), exibe o botão de congelar e enviar
  return (
    <button
      onClick={handleSend}
      disabled={isLoading}
      className="flex items-center gap-2 px-6 py-2.5 bg-lime-400 hover:bg-lime-500 text-black font-bold rounded-xl transition-all disabled:opacity-50"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Congelando & Enviando...
        </>
      ) : (
        <>
          <Send className="w-4 h-4" />
          Enviar para Assinatura
        </>
      )}
    </button>
  );
}