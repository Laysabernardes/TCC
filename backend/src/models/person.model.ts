import { Schema, model, Document } from 'mongoose';

export interface IPerson extends Document {
  name: string;
  kind: string; // Ex: "Membro da Equipe", "Colaborador", "Autor"
  description: string[];
  contact?: string; 
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const personSchema = new Schema<IPerson>({
  name: { 
    type: String, 
    required: true
  },
  kind: { 
    type: String, 
    required: true 
  },
  description: { 
    type: [String],
    default: [] 
  },
  contact: { 
    type: String 
  },
  imageUrl: { 
    type: String 
  }
}, {
  timestamps: true 
});

export const PersonModel = model<IPerson>('Person', personSchema);