import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");
const projectBodyBaseSchema = z.object({
  title: z.string().min(1, { message: "O título é obrigatório" }),
  subtitle: z.string().optional(),
  slug: z
    .string()
    .min(1, { message: "O slug é obrigatório" })
    .regex(/^[a-z0-9-]+$/),
  about_html: z.string().optional(),
  team: z.array(objectIdSchema).optional(),
  status: z.enum(["draft", "published"]).optional(),
  isCarousel: z.boolean().optional(),
  orderCarousel: z.number().optional(),
  banner: z.string().url({ message: "URL do banner inválida" }).optional(),
  extraURL: z.string().url({ message: "URL extra inválida" }).optional(),
});

export const createProjectSchema = z.object({
  body: projectBodyBaseSchema,
});

export const updateProjectSchema = z.object({
  body: projectBodyBaseSchema.partial(),
});
