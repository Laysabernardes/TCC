import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID inválido");

export const createPerspectiveSchema = z.object({
  body: z.object({
    // Ao criar uma perspectiva, é OBRIGATÓRIO informar a qual projeto ela pertence.
    projectId: objectIdSchema,

    title: z.string().min(1, { message: "O título é obrigatório" }),
    slug: z.string().min(1, { message: "O slug é obrigatório" }),

    // Os demais campos são opcionais na criação
    order: z.number().optional(),
    content: z.string().optional(),
    references: z.array(z.object({ text: z.string() })).optional(),
    authors: z.array(objectIdSchema).optional(),
    isCarrossel: z.boolean().optional(),
    orderCarrossel: z.number().optional(),
    banner: z.string().url({ message: "URL do banner inválida" }).optional(),
    extraURL: z.string().url({ message: "URL extra inválida" }).optional(),
  }),
});

export const updatePerspectiveSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    order: z.number().optional(),
    content: z.string().optional(),
    references: z.array(z.object({ text: z.string() })).optional(),
    authors: z.array(objectIdSchema).optional(),
    isCarrossel: z.boolean().optional(),
    orderCarrossel: z.number().optional(),
    banner: z.string().url({ message: "URL do banner inválida" }).optional(),
    extraURL: z.string().url({ message: "URL extra inválida" }).optional(),
  }),
});
