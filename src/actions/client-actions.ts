'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Esquema de validação com Zod
const clientSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().optional(),
  company: z.string().optional(),
})

export type CreateClientInput = z.infer<typeof clientSchema>

/**
 * Cadastra um novo cliente vinculado ao prestador logado.
 */
export async function createClientAction(userId: string, data: CreateClientInput) {
  try {
    const validated = clientSchema.parse(data)

    const client = await prisma.client.create({
      data: {
        ...validated,
        userId,
      },
    })

    // Atualiza o cache do Next.js nas páginas que usam a lista de clientes
    revalidatePath('/dashboard')
    revalidatePath('/clients')
    revalidatePath('/proposals/new')

    return { success: true, data: client }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: 'Erro ao cadastrar o cliente. Tente novamente.' }
  }
}