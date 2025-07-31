import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID');
const projectBodyBaseSchema = z.object({
  project_title: z.string().min(1, { message: 'O título é obrigatório' }),
  project_subtitle: z.string().optional(),
  project_slug: z.string().min(1, { message: 'O slug é obrigatório' }).regex(/^[a-z0-9-]+$/),
  project_about_html: z.string().optional(),
  project_team: z.array(objectIdSchema).optional(),
  project_status: z.enum(['draft', 'published']).optional(),
  isCarrossel: z.boolean().optional(),
  orderCarrossel: z.number().optional(),
  banner: z.string().url({ message: "URL do banner inválida" }).optional(),
  extraURL: z.string().url({ message: "URL extra inválida" }).optional(),
});

export const createProjectSchema = z.object({
  body: projectBodyBaseSchema,
});

export const updateProjectSchema = z.object({
  body: projectBodyBaseSchema.partial(),
});