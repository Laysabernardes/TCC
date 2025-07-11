
import { PersonResponseType } from './person.dto';

export interface ProjectResponseType {
  _id: string;
  name: string;
  slug: string;
  about_html: string;
  team: PersonResponseType[];
  createdAt: Date;
  updatedAt: Date;
}