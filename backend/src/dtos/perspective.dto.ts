import { PersonResponseType } from "./person.dto";

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
  content: string[];
  references: IReferenceDTO[];
  authors: PersonResponseType[];
  isCarousel?: boolean;
  orderCarousel?: number;
  banner?: string;
  extraURL?: string;
  createdAt: Date;
  updatedAt: Date;
}
