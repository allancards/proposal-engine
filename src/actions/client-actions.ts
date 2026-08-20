'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const clientSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().optional(),
  company: z.string().optional(),
})

export type CreateClientInput = z.infer<typeof clientSchema>

export async function createClientAction(userId: string, data: CreateClientInput) {
  try {
    const validated = clientSchema.parse(data)

    // 1. Garante que o ID do Clerk existe na tabela User para não violar a Foreign Key
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: validated.email,
        name: 'Usuário do Sistema',
      },
    })

    // 2. Cria o cliente vinculado ao usuário
    const client = await prisma.client.create({
      data: {
        ...validated,
        userId,
      },
    })

    revalidatePath('/dashboard')
    revalidatePath('/clients')
    revalidatePath('/proposals/new')

    return { success: true, data: client }
  } catch (error) {
    // Exibe o erro exato do Prisma/Postgres no terminal do VS Code
    console.error('Erro detalhado no createClientAction:', error)

    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: 'Erro ao cadastrar o cliente. Tente novamente.' }
  }
}