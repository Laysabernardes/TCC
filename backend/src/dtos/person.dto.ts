export interface PersonResponseType {
  _id: string;
  name: string;
  kind: string;
  description: string[];
  contact?: string;
  imageUrl?: string;
}