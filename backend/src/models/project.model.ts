import { Schema, model, Document } from 'mongoose';
import { IPerson } from './person.model';

export interface IProject extends Document {
  name: string;
  slug: string;
  about_html: string; 
  team: (IPerson['_id'] | IPerson)[]; // <-- pessoas
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  about_html: { type: String, default: '' },
  team: [{ type: Schema.Types.ObjectId, ref: 'Person' }], 
}, { timestamps: true });

export const ProjectModel = model<IProject>('Project', projectSchema);