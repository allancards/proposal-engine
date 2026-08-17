"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { signProposalAction } from "@/actions/sign-actions";
import { X, RotateCcw, Check, Loader2 } from "lucide-react";

interface SignatureModalProps {
  token: string;
  isOpen: boolean;
  onClose: () => void;
}

export function SignatureModal({ token, isOpen, onClose }: SignatureModalProps) {
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  function handleClear() {
    sigCanvas.current?.clear();
    setError("");
  }

  async function handleConfirm() {
    if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
      setError("Por favor, desenhe sua assinatura antes de confirmar.");
      return;
    }

    setIsLoading(true);
    setError("");

    // Converte o desenho do Canvas em uma imagem PNG em formato Base64
    const signatureData = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");

    const result = await signProposalAction(token, signatureData);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || "Erro ao salvar assinatura.");
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4 p-6">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
          <h3 className="font-bold text-lg text-white">Assinar Proposta</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs text-zinc-400">
            Desenhe sua assinatura no quadro abaixo usando o mouse ou o dedo:
          </p>
          <div className="border border-zinc-700 rounded-xl bg-zinc-950 overflow-hidden touch-none">
            <SignatureCanvas
              ref={sigCanvas}
              penColor="#ffffff"
              canvasProps={{
                className: "w-full h-44 cursor-crosshair",
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Limpar
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2 bg-lime-400 hover:bg-lime-500 text-black font-bold text-xs rounded-xl transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Confirmar Assinatura
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}