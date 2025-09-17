import { z } from "zod";

/**
 * @const objectIdSchema
 * @description Schema reutilizável para validar strings que se parecem com um ObjectId do MongoDB.
 */
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

/**
 * @const projectBodyBaseSchema
 * @description Define a estrutura e as validações base para o corpo (body) de uma requisição de Projeto.
 * É usado como base para os schemas de criação e atualização.
 */
const projectBodyBaseSchema = z.object({
  title: z.string().min(1, { message: "O título é obrigatório" }),
  subtitle: z.string().optional(),
  slug: z
    .string()
    .min(1, { message: "O slug é obrigatório" })
    .regex(/^[a-z0-9-]+$/),
  category: z.string().min(1, { message: "A categoria é obrigatória" }),
  year: z.number() 
           .int({ message: "O ano deve ser um número inteiro." }),
  about_html: z.string().optional(),
  team: z.array(objectIdSchema).optional(),
  status: z.enum(["draft", "published"]).optional(),
  isCarousel: z.boolean().optional(),
  orderCarousel: z.number().optional(),
  banner: z.string().url({ message: "URL do banner inválida" }).optional(),
  extraURL: z.string().url({ message: "URL extra inválida" }).optional(),
});

/**
 * @const createProjectSchema
 * @description Schema para validar a CRIAÇÃO de um novo Projeto.
 * Garante que todos os campos necessários sejam fornecidos.
 * @exports
 */
export const createProjectSchema = z.object({
  body: projectBodyBaseSchema.refine(data => data.category !== undefined, {
    message: "A categoria é obrigatória.",
    path: ["category"],
  }),
});

/**
 * @const updateProjectSchema
 * @description Schema para validar a ATUALIZAÇÃO de um Projeto existente.
 * Utiliza `.partial()` para tornar todos os campos do schema base opcionais,
 * permitindo atualizações parciais.
 * @exports
 */
export const updateProjectSchema = z.object({
  body: projectBodyBaseSchema.partial(),
});