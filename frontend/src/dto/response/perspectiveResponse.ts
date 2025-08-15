export default interface PerspectiveResponse {
  _id: string;
  projectId: string;
  perspective_title: string;
  perspective_subtitle: string;
  perspective_slug: string;
  perspective_order: number;
  perspective_about_html: string;
  perspective_refs: string[];
  perspective_team: any[];
  perspective_status: string;
  perspective_isCarrossel: boolean;
  perspective_orderCarrossel: number;
  perspective_banner: string;
  perspective_extraURL: string;
  createdAt: string;
  updatedAt: string;
}
