import { z } from "zod";

// --- DEFINIÇÃO DOS SCHEMAS E TIPOS PARA BLOCOS DE CONTEÚDO ---
export const textBlockSchema = z.object({ type: z.literal("text"), content: z.string().optional() });
export const titleBlockSchema = z.object({ type: z.literal("title"), content: z.string().optional() });
export const imageBlockSchema = z.object({ type: z.literal("image"), imageUrl: z.string().url().or(z.literal("")).nullable().optional(),
  caption: z.string().optional()});
export const highlightBlockSchema = z.object({ type: z.literal("highlight"), content: z.string().optional() });

export const contentBlockSchema = z.discriminatedUnion("type", [
  textBlockSchema,
  titleBlockSchema,
  imageBlockSchema,
  highlightBlockSchema,
]);

// --- SCHEMA PRINCIPAL DO FORMULÁRIO ---

export const FormPerspectiveData = z.object({
  _id: z.string().optional(),
  projectId: z.string().min(1, "É obrigatório selecionar um projeto"),
  title: z.string().min(1, "O título é obrigatório"),
  slug: z.string().min(1, "O slug é obrigatório"),
  banner: z.string().nullable().optional(),
  order:  z.number(),
  authors: z.array(z.string()).optional(),
  references: z.array(z.object({ text: z.string() })).optional(),
  contentBlocks:  z.array(z.any()).optional(),
  isCarousel: z.boolean().optional(),
  orderCarousel: z.number().optional(),
  extraURL: z.string().optional(),
});

export type PerspectiveFormData = z.infer<typeof FormPerspectiveData>;
export type IContentBlock = z.infer<typeof contentBlockSchema>;