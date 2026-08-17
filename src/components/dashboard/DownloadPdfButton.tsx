"use client";

import { FileDown } from "lucide-react";

export function DownloadPdfButton({ proposalId }: { proposalId: string }) {
  function handleDownload() {
    // Abre o PDF em uma nova aba
    window.open(`/api/proposals/${proposalId}/pdf`, "_blank");
  }

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs rounded-xl transition-all border border-zinc-700"
    >
      <FileDown className="w-4 h-4 text-lime-400" />
      Baixar PDF Autenticado
    </button>
  );
}