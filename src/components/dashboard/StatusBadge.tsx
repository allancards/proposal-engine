import { ProposalStatus } from "@prisma/client";

const statusConfig: Record<
  ProposalStatus,
  { label: string; className: string }
> = {
  DRAFT: {
    label: "Rascunho",
    className: "bg-zinc-800 text-zinc-400 border-zinc-700",
  },
  SENT: {
    label: "Enviado",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  },
  VIEWED: {
    label: "Visualizado",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
  SIGNED: {
    label: "Assinado",
    className: "bg-lime-500/10 text-lime-400 border-lime-500/30",
  },
  EXPIRED: {
    label: "Expirado",
    className: "bg-red-500/10 text-red-400 border-red-500/30",
  },
    CANCELLED: {
    label: "Cancelado",
    className: "bg-red-500/10 text-red-400 border-red-500/30",
  },
};

export function StatusBadge({ status }: { status: ProposalStatus }) {
  const config = statusConfig[status] || statusConfig.DRAFT;

  return (
    <span
      className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${config.className}`}
    >
      {config.label}
    </span>
  );
}