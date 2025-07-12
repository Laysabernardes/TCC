export interface TimelineEventResponseType {
  _id: string;
  projectId: string; 
  title: string;
  order: number;
  description_html: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}