import { PersonResponseType } from './person.dto'; 

// DTO para as referências (que são parte da perspectiva)
interface IReferenceDTO {
  text: string;
}

export interface PerspectiveResponseType {
  _id: string;
  projectId: string; // O ID do projeto pai
  title: string;
  slug: string;
  order: number;
  template: number;
  images: string[];
  content: string[];
  editoria: string[];
  references: IReferenceDTO[];
  authors: PersonResponseType[]; 
  createdAt: Date;
  updatedAt: Date;
}