'use server'

import { revalidatePath } from 'next/cache'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ProposalStatus } from '@prisma/client'
import { z } from 'zod'
import { serializeProposal } from '@/lib/serialize'
import { resend } from '@/lib/resend'

// Esquema de validação mantendo a estrutura exata do seu schema.prisma
const createProposalSchema = z.object({
  clientId: z.string().min(1, 'Selecione um cliente'),
  title: z.string().min(3, 'O título deve ter no mínimo 3 caracteres'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
  amount: z.coerce.number().positive({ message: 'O valor deve ser maior que zero' }),
  expiresAt: z.coerce.date().refine((date) => date > new Date(), {
    message: 'A data de expiração deve ser uma data futura',
  }),
})

export type CreateProposalInput = z.infer<typeof createProposalSchema>

export async function createProposalAction(input: { userId: string } & CreateProposalInput) {
  try {
    // Valida os dados ignorando o userId na validação do Zod
    const { userId, ...data } = input
    const validated = createProposalSchema.parse(data)

    const clerkUser = await currentUser()
    const realEmail = clerkUser?.emailAddresses[0]?.emailAddress || 'prestador@exemplo.com'
    const realName = clerkUser?.fullName || clerkUser?.firstName || 'Prestador de Serviço'

    await prisma.user.upsert({
      where: { id: userId },
      update: {
        name: realName,
        email: realEmail,
      },
      create: {
        id: userId,
        name: realName,
        email: realEmail,
      },
    })

    const proposal = await prisma.proposal.create({
      data: {
        userId,
        clientId: validated.clientId,
        title: validated.title,
        description: validated.description,
        amount: validated.amount,
        expiresAt: validated.expiresAt,
        status: ProposalStatus.DRAFT,
      },
    })

    revalidatePath('/dashboard')
    revalidatePath('/proposals')

    return { success: true, data: serializeProposal(proposal) }
  } catch (error) {
    console.error('Erro detalhado no createProposalAction:', error)

    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: 'Erro ao criar proposta em rascunho.' }
  }
}

export async function sendProposalAction(proposalId: string) {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { client: true, user: true },
    })

    if (!proposal) {
      return { success: false, error: 'Proposta não encontrada.' }
    }

    if (proposal.status !== ProposalStatus.DRAFT) {
      return { 
        success: false, 
        error: 'Esta proposta já foi enviada ou congelada.' 
      }
    }

    const updatedProposal = await prisma.proposal.update({
      where: { id: proposalId },
      data: {
        status: ProposalStatus.SENT,
        sentAt: new Date(),
      },
    })

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const publicUrl = `${baseUrl}/p/${updatedProposal.token}`

    await resend.emails.send({
      from: 'ProposalEngine <onboarding@resend.dev>',
      to: [proposal.client.email],
      subject: `Proposta Comercial: ${proposal.title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #18181b;">
          <h2 style="color: #09090b;">Nova Proposta Comercial Recebida</h2>
          <p>Olá, <strong>${proposal.client.name}</strong>!</p>
          <p>
            <strong>${proposal.user.name}</strong> enviou uma proposta comercial referente a:
            <br />
            <em>"${proposal.title}"</em>
          </p>
          <p>
            <strong>Valor Total:</strong> R$ ${Number(proposal.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <div style="margin: 30px 0;">
            <a href="${publicUrl}" 
               style="background-color: #84cc16; color: #000000; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Visualizar e Assinar Proposta
            </a>
          </div>
          <p style="font-size: 12px; color: #71717a;">
            Se o botão acima não funcionar, copie e cole este link no seu navegador:<br />
            <a href="${publicUrl}" style="color: #84cc16;">${publicUrl}</a>
          </p>
        </div>
      `,
    })

    revalidatePath('/dashboard')
    revalidatePath(`/proposals/${proposalId}`)

    return { success: true, data: serializeProposal(updatedProposal) }
  } catch (error) {
    console.error('Erro ao enviar proposta/e-mail:', error)
    return { success: false, error: 'Erro ao enviar a proposta por e-mail.' }
  }
}