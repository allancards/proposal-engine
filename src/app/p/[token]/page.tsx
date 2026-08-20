
export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProposalStatus } from "@prisma/client";
import { ClientPublicView } from "@/components/signature/ClientPublicView";
import {serializeProposal} from "@/lib/serialize";

export default async function PublicProposalPage({ params }: { params: Promise<{ token : string }> }) {
  const paramsResolved = await params;
  const proposal = await prisma.proposal.findUnique({
    where: { token: paramsResolved.token },
    include: { client: true, user: true, audit: true },
  });

  if (!proposal) {
    notFound();
  }
  

  // Transição automática: Se estava SENT, marca como VIEWED assim que abre
  if (proposal.status === ProposalStatus.SENT) {
    await prisma.proposal.update({
      where: { id: proposal.id },
      data: {
        status: ProposalStatus.VIEWED,
        viewedAt: new Date(),
      },
    });
  }


  const serializedProposal = serializeProposal(proposal);

  return <ClientPublicView proposal={serializedProposal} />;
}