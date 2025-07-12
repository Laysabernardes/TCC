import { Schema, model, Document } from 'mongoose';
import { IPerson } from './person.model'; // Usaremos para os autores

// Interface para as referências, que serão embarcadas
interface IReference {
  text: string;
}

// Interface principal da Perspectiva
export interface IPerspective extends Document {
  // --- A LIGAÇÃO COM O PROJETO "PAI" ---
  projectId: Schema.Types.ObjectId;
  
  title: string;
  slug: string;
  order: number;
  template: number;
  images: string[];
  content: string[];
  editoria: string[];
  references: IReference[];
  authors: (IPerson['_id'] | IPerson)[];
  createdAt: Date;
  updatedAt: Date;
}

const perspectiveSchema = new Schema<IPerspective>({
  // Adicionamos o campo de referência ao projeto, que é obrigatório e indexado para buscas rápidas.
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // slug de perspectiva também deve ser único
  order: { type: Number, default: 0 },
  template: { type: Number, default: 1 },
  images: { type: [String], default: [] },
  content: { type: [String], default: [] },
  editoria: { type: [String], default: [] },
  references: [new Schema<IReference>({ text: String }, { _id: false })],
  authors: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
}, { timestamps: true });


export const PerspectiveModel = model<IPerspective>('Perspective', perspectiveSchema);