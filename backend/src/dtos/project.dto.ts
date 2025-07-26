
import { PersonResponseType } from './person.dto';

export interface ProjectResponseType {
  _id: string;
  project_name: string;
  project_slug: string;
  project_about_html: string;
  project_team: PersonResponseType[];
  project_createdAt: Date;
  project_updatedAt: Date;
}