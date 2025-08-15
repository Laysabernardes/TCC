export default interface ProjectResponse {
  _id: string;
  project_title: string;
  project_subtitle: string;
  project_slug: string;
  project_about_html: string;
  project_team: any[];
  project_status: string;
  isCarrossel: boolean;
  orderCarrossel: number;
  banner: string;
  extraURL: string;
  createdAt: string;
  updatedAt: string;
}
