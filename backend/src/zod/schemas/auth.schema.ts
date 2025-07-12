import { z } from 'zod'

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('O formato do email é inválido'),
    password: z.string().min(1, 'A senha é obrigatória'),
  }),
});