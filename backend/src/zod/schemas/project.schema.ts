import { z } from 'zod';

// Componente reutilizável para validar um ObjectId do MongoDB
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID inválido');

// =================================================================
// 1. SCHEMA PARA A AÇÃO DE CRIAR UM PROJETO
// Usado em: POST /api/projects
// =================================================================
export const createProjectSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, { message: 'O nome é obrigatório' }) // CORRIGIDO
      .min(3, 'O nome deve ter no mínimo 3 caracteres'),
    
    slug: z
      .string()
      .min(1, { message: 'O slug é obrigatório' }) // CORRIGIDO
      .min(3, 'O slug deve ter no mínimo 3 caracteres')
      .regex(
        /^[a-z0-9-]+$/,
        'O slug deve conter apenas letras minúsculas, números e hifens'
      ),
  }),
});

// =================================================================
// 2. SCHEMA PARA A AÇÃO DE ATUALIZAR UM PROJETO
// Usado em: PUT /api/projects/:id
// =================================================================
export const updateProjectSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres').optional(),
    slug: z.string().min(3).regex(/^[a-z0-9-]+$/).optional(),
    about: z
      .object({
        content_html: z.string().optional(),
      })
      .optional(),
    members: z.array(objectIdSchema).optional(),
    collaborators: z.array(objectIdSchema).optional(),
  }),
});

// =================================================================
// 3. SCHEMA PARA A AÇÃO DE ADICIONAR UMA PERSPECTIVA
// Usado em: POST /api/projects/:projectId/perspectives
// =================================================================
export const addPerspectiveSchema = z.object({
  params: z.object({
    projectId: objectIdSchema,
  }),
  body: z.object({
    title: z.string().min(1, { message: 'O título da perspectiva é obrigatório' }), // CORRIGIDO
    slug: z.string().min(1, { message: 'O slug da perspectiva é obrigatório' }), // CORRIGIDO
    order: z.number().optional().default(0),
    template: z.number().optional().default(1),
    images: z.array(z.string()).optional(),
    content: z.array(z.string()).optional(),
    editoria: z.array(z.string()).optional(),
    references: z
      .array(z.object({ text: z.string() }))
      .optional(),
    authors: z.array(objectIdSchema).optional(),
  }),
});

// =================================================================
// 4. SCHEMA PARA A AÇÃO DE ADICIONAR UM EVENTO NA LINHA DO TEMPO
// Usado em: POST /api/projects/:projectId/timeline
// =================================================================
export const addTimelineEventSchema = z.object({
  params: z.object({
    projectId: objectIdSchema,
  }),
  body: z.object({
    title: z.string().min(1, { message: 'O título do evento é obrigatório' }), // CORRIGIDO
    order: z.number().optional().default(0),
    description_html: z.string().optional(),
    imageUrl: z.string().url({ message: "URL da imagem inválida" }).optional(),
  }),
});


// =================================================================
// 5. SCHEMA PARA A RESPOSTA COMPLETA DE UM PROJETO
// Usado para: Documentação do Swagger da rota GET /api/projects/:slug
// (Este não tinha o erro pois não usava validação de "required")
// =================================================================
export const fullProjectResponseSchema = z.object({
    _id: z.string(),
    name: z.string(),
    slug: z.string(),
    about: z.object({
      content_html: z.string(),
    }),
    members: z.array(z.object({
      _id: z.string(),
      name: z.string(),
      kind: z.string(),
    })),
    collaborators: z.array(z.object({
      _id: z.string(),
      name: z.string(),
      kind: z.string(),
    })),
    perspectives: z.array(z.object({
      _id: z.string(),
      title: z.string(),
      slug: z.string(),
      order: z.number(),
      template: z.number(),
      images: z.array(z.string()),
      content: z.array(z.string()),
      editoria: z.array(z.string()),
      references: z.array(z.object({ text: z.string() })),
      authors: z.array(z.object({ _id: z.string(), name: z.string() })),
    })),
    timeline: z.array(z.object({
      _id: z.string(),
      title: z.string(),
      order: z.number(),
      description_html: z.string(),
      imageUrl: z.string(),
    })),
    createdAt: z.date(),
    updatedAt: z.date(),
});