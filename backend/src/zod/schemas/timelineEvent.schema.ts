import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID inválido');

export const createTimelineEventSchema = z.object({
  body: z.object({
    projectId: objectIdSchema,
    
    title: z.string().min(1, { message: 'O título do evento é obrigatório' }),

    order: z.number().optional().default(0),
    description_html: z.string().optional(),
    imageUrl: z.string().url({ message: "URL da imagem inválida" }).optional(),
  }),
});

export const updateTimelineEventSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    order: z.number().optional(),
    description_html: z.string().optional(),
    imageUrl: z.string().url().optional(),
  }),
});