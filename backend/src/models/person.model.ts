import { Schema, model, Document } from 'mongoose';
export interface IPerson extends Document {
  name: string;
  kind: string;
  description: string[];
  contact?: string; 
  imageUrl?: string;
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