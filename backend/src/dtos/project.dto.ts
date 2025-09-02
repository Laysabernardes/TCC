import { PersonResponseType } from "./person.dto";

export interface ProjectResponseType {
  _id: string;
  title: string;
  subtitle: string;
  slug: string;
  about_html: string;
  team: PersonResponseType[];
  status: "draft" | "published";
  isCarousel?: boolean;
  orderCarousel?: number;
  banner?: string;
  extraURL?: string;
  createdAt: Date;
  updatedAt: Date;
}
