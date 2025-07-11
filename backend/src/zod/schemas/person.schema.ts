import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID inválido');

// Schema para CRIAR uma pessoa
export const createPersonSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'O nome é obrigatório' }),
    kind: z.string().min(1, { message: 'O tipo (kind) é obrigatório' }),
    description: z.array(z.string()).optional(),
    contact: z.string().email("Formato de email inválido").optional(),
    imageUrl: z.string().url("Formato de URL inválido").optional(),
  }),
});

// Schema para ATUALIZAR uma pessoa
export const updatePersonSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    kind: z.string().min(1).optional(),
    description: z.array(z.string()).optional(),
    contact: z.string().email("Formato de email inválido").optional(),
    imageUrl: z.string().url("Formato de URL inválido").optional(),
  }),
});