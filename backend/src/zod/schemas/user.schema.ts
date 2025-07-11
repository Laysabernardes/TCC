import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'O nome é obrigatório'),
    email: z.string().email('O email é inválido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    role: z.enum(['admin', 'editor']).optional(),
  }),
});