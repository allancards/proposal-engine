'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { ProposalStatus } from '@prisma/client'
import { headers } from 'next/headers'

export async function signProposalAction(token: string, signatureImageBase64: string) {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { token },
      include: { client: true },
    })

    if (!proposal) {
      return { success: false, error: 'Proposta não encontrada.' }
    }

    if (proposal.status === ProposalStatus.SIGNED) {
      return { success: false, error: 'Esta proposta já foi assinada.' }
    }

    if (new Date() > new Date(proposal.expiresAt)) {
      await prisma.proposal.update({
        where: { id: proposal.id },
        data: { status: ProposalStatus.EXPIRED },
      })
      return { success: false, error: 'Esta proposta está expirada.' }
    }

    // Captura o IP e o Navegador do cliente no servidor
    const headerList = await headers()
    const ipAddress = headerList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'
    const userAgent = headerList.get('user-agent') || 'Desconhecido'

    // Transação do banco: marca como SIGNED e salva o registro de auditoria
    await prisma.$transaction([
      prisma.proposal.update({
        where: { id: proposal.id },
        data: {
          status: ProposalStatus.SIGNED,
          signedAt: new Date(),
        },
      }),
      prisma.signatureAudit.create({
        data: {
          proposalId: proposal.id,
          signerName: proposal.client.name,
          signerEmail: proposal.client.email,
          signatureImageUrl: signatureImageBase64,
          ipAddress,
          userAgent,
        },
      }),
    ])

    revalidatePath(`/p/${token}`)
    revalidatePath('/dashboard')

    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Erro ao registrar assinatura.' }
  }
}