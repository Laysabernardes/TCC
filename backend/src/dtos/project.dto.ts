interface IReferenceDTO {
  text: string;
}

interface IPerspectiveDTO {
  _id: string;
  title: string;
  slug: string;
  order: number;
  template: number;
  images: string[];
  content: string[];
  editoria: string[];
  references: IReferenceDTO[];
  authors: any[]; 
}

interface ITimelineEventDTO {
  _id: string;
  title: string;
  order: number;
  description_html: string;
  imageUrl: string;
}

export type ProjectResponseType = {
  _id: string;
  name: string;
  slug: string;
  about: {
    content_html: string;
  };
  members: any[]; 
  collaborators: any[];
  perspectives: IPerspectiveDTO[];
  timeline: ITimelineEventDTO[];
  createdAt: Date;
  updatedAt: Date;
}