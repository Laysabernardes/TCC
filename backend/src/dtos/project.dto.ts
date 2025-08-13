import { PersonResponseType } from "./person.dto";

export interface ProjectResponseType {
  _id: string;
  project_title: string;
  project_subtitle: string;
  project_slug: string;
  project_about_html: string;
  project_team: PersonResponseType[];
  project_status: "draft" | "published";
  isCarrossel?: boolean;
  orderCarrossel?: number;
  banner?: string;
  extraURL?: string;
  project_createdAt: Date;
  project_updatedAt: Date;
}
