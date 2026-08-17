import { Proposal } from '@prisma/client';

export function serializeProposal(proposal: any) {
  return {
    ...proposal,
    amount: proposal.amount?.toString?.() ?? proposal.amount,
    expiresAt: proposal.expiresAt?.toISOString?.() ?? proposal.expiresAt,
    sentAt: proposal.sentAt?.toISOString?.() ?? proposal.sentAt,
    viewedAt: proposal.viewedAt?.toISOString?.() ?? proposal.viewedAt,
    signedAt: proposal.signedAt?.toISOString?.() ?? proposal.signedAt,
    createdAt: proposal.createdAt?.toISOString?.() ?? proposal.createdAt,
    updatedAt: proposal.updatedAt?.toISOString?.() ?? proposal.updatedAt,
  };
}