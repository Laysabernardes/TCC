import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID inválido');

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'O nome é obrigatório' }),
    slug: z.string().min(1, { message: 'O slug é obrigatório' }).regex(/^[a-z0-9-]+$/),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
    about_html: z.string().optional(),
    team: z.array(objectIdSchema).optional(),
  }),
});