import { Schema, model, Document } from 'mongoose';
import { IPerson } from './person.model'; 

interface IReference {
  text: string;
}

interface IPerspective {
  _id?: string;
  title: string;
  slug: string;
  order: number;
  template: number;
  images: string[];
  content: string[];
  editoria: string[];
  references: IReference[];
  authors: (IPerson['_id'] | IPerson)[]; // Array de IDs ou documentos populados
}

interface ITimelineEvent {
  _id?: string;
  title: string;
  order: number;
  description_html: string;
  imageUrl: string;
}

// --- Interface principal do Projeto ---
export interface IProject extends Document {
  name: string;
  slug: string;
  about: {
    content_html: string;
  };
  members: (IPerson['_id'] | IPerson)[];
  collaborators: (IPerson['_id'] | IPerson)[];
  perspectives: IPerspective[];
  timeline: ITimelineEvent[];

  createdAt: Date;
  updatedAt: Date;
}


// 1. O Schema (A planta baixa do projeto)
const projectSchema = new Schema<IProject>({
  name: { 
    type: String, 
    required: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true // Garante que não haverá dois projetos com o mesmo slug
  },
  about: {
    content_html: { type: String, default: '' }
  },
  // --- Campos de Referência ---
  members: [
    { 
      type: Schema.Types.ObjectId, // Armazena apenas o ID
      ref: 'Person' // Diz ao Mongoose que este ID se refere a um documento na collection 'people'
    }
  ],
  collaborators: [
    { 
      type: Schema.Types.ObjectId, 
      ref: 'Person' 
    }
  ],
  // --- Campos Embarcados ---
  perspectives: [
    new Schema<IPerspective>({ // Schema para o sub-documento
      title: { type: String, required: true },
      slug: { type: String, required: true },
      order: { type: Number, default: 0 },
      template: { type: Number, default: 1 },
      images: { type: [String], default: [] },
      content: { type: [String], default: [] },
      editoria: { type: [String], default: [] },
      references: [new Schema<IReference>({ text: String })],
      authors: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
    })
  ],
  timeline: [
    new Schema<ITimelineEvent>({ // Schema para o sub-documento
      title: { type: String, required: true },
      order: { type: Number, default: 0 },
      description_html: { type: String, default: '' },
      imageUrl: { type: String, default: '' }
    })
  ]
}, {
  timestamps: true // Adiciona createdAt e updatedAt
});

export const ProjectModel = model<IProject>('Project', projectSchema);