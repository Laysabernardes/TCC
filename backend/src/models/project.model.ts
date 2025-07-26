import { Schema, model, Document } from 'mongoose';
import { IPerson } from './person.model';

export interface IProject extends Document {
  project_name: string;
  project_slug: string;
  project_about_html: string; 
  project_team: (IPerson['_id'] | IPerson)[]; // <-- pessoas
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>({
  project_name: { type: String, required: true },
  project_slug: { type: String, required: true, unique: true, index: true },
  project_about_html: { type: String, default: '' },
  project_team: [{ type: Schema.Types.ObjectId, ref: 'Person' }], 
}, { timestamps: true });

export const ProjectModel = model<IProject>('Project', projectSchema);