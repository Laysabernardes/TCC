/**
 * @file project.model.ts
 * @description Define o schema e o modelo de dados para a entidade 'Project'.
 */
import { Schema, model, Document } from "mongoose";
import { IPerson } from "./person.model";
import { ICarousel, carouselSchema } from "./carousel.model";

/**
 * @interface IProject
 * @description Interface que representa o documento de um 'Projeto' no MongoDB.
 * @exports
 */
export interface IProject extends Document {
  title: string;
  subtitle: string;
  slug: string;
  category: string;
  year: number;
  about_html: string;
  team: (IPerson["_id"] | IPerson)[];
  status: "draft" | "published";
  isCarousel?: boolean;
  orderCarousel?: number;
  extraURL?: string;
  // carousel?: ICarousel;
  banner: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @const projectSchema
 * @description Schema do Mongoose que define a estrutura, validações e índices
 * para os documentos da coleção 'projects'.
 */
const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    slug: { type: String, required: true, unique: true, index: true },
    about_html: { type: String, default: "" },
    category: { type: String, required: true, index: true },
    year: { type: Number, required: true, index: true },
    team: [{ type: Schema.Types.ObjectId, ref: "Person" }],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    isCarousel: { type: Boolean, default: false },
    orderCarousel: { type: Number, required: false },
    extraURL: { type: String, required: false },
    banner: { type: String },
  },
  { timestamps: true }
);

/**
 * Cria um índice único para 'orderCarousel', mas apenas para os documentos
 * que de fato possuem este campo. Isso permite que múltiplos projetos
 * não tenham 'orderCarousel', mas garante que, se tiverem, o valor será único.
 */
projectSchema.index(
  { orderCarousel: 1 },
  {
    unique: true,
    partialFilterExpression: { orderCarousel: { $exists: true } },
  }
);

/**
 * @const ProjectModel
 * @description O modelo Mongoose compilado para a entidade 'Project'.
 * É através dele que o Service realizará as operações de CRUD no banco de dados.
 */
export const ProjectModel = model<IProject>("Project", projectSchema);