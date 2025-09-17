import { z } from "zod";

/**
 * Schema reutilizável para validar strings que representam um ObjectId do MongoDB.
 */
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID inválido");

// --- DEFINIÇÃO DOS SCHEMAS PARA BLOCOS DE CONTEÚDO ---

const textBlockSchema = z.object({
  type: z.literal("text"),
  content: z.string().min(1, { message: "O conteúdo do texto é obrigatório." }),
});

const titleBlockSchema = z.object({
  type: z.literal("title"),
  content: z.string().min(1, { message: "O conteúdo do título é obrigatório." }),
});

const imageBlockSchema = z.object({
  type: z.literal("image"),
  imageUrl: z.string().url({ message: "URL da imagem inválida." }),
  caption: z.string().optional().default(""),
});

const highlightBlockSchema = z.object({
  type: z.literal("highlight"),
  content: z.string().min(1, { message: "O conteúdo de destaque é obrigatório." }),
});

/**
 * Schema principal para os blocos de conteúdo.
 * Usa z.union para validar que o objeto corresponde a um dos schemas de bloco definidos.
 */
const contentBlockSchema = z.union([
  textBlockSchema,
  titleBlockSchema,
  imageBlockSchema,
  highlightBlockSchema,
]);

/**
 * Schema para a CRIAÇÃO de uma nova Perspectiva.
 */
export const createPerspectiveSchema = z.object({
  body: z.object({
    // Campos obrigatórios na criação
    projectId: objectIdSchema,
    title: z.string().min(1, { message: "O título é obrigatório" }),
    slug: z.string().min(1, { message: "O slug é obrigatório" }),
    order: z.number().min(1, { message: "A ordem é obrigatório" }),
    // Campos opcionais
    contentBlocks: z.array(contentBlockSchema).optional(),
    references: z.array(z.object({ text: z.string() })).optional(),
    authors: z.array(objectIdSchema).optional(),
    banner: z.string().url({ message: "URL do banner inválida" }).optional(),

    // --- CAMPOS DO CARROSSEL 
    isCarousel: z.boolean().optional(),
    orderCarousel: z.number().optional(),
    extraURL: z.string().url({ message: "URL extra inválida" }).optional(),
  }),
});

/**
 * Schema para a ATUALIZAÇÃO de uma Perspectiva existente.
 */
export const updatePerspectiveSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    contentBlocks: z.array(contentBlockSchema).optional(), // Estrutura nova e correta
    order: z.number().min(1).optional(),
    references: z.array(z.object({ text: z.string() })).optional(),
    authors: z.array(objectIdSchema).optional(),
    banner: z.string().url({ message: "URL do banner inválida" }).optional(),

    // --- CAMPOS DO CARROSSEL (COMO ESTÁ HOJE) ---
    isCarousel: z.boolean().optional(),
    orderCarousel: z.number().optional(),
    extraURL: z.string().url({ message: "URL extra inválida" }).optional(),
  }),
});