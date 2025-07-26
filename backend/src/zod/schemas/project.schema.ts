import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID inválido');

export const createProjectSchema = z.object({
  body: z.object({
    project_name: z.string().min(1, { message: 'O nome é obrigatório' }),
    project_slug: z.string().min(1, { message: 'O slug é obrigatório' }).regex(/^[a-z0-9-]+$/),
    project_about_html: z.string().optional(),
    project_team: z.array(objectIdSchema).optional(),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    project_name: z.string().min(1).optional(),
    project_slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
    project_about_html: z.string().optional(),
    project_team: z.array(objectIdSchema).optional(),
  }),
});