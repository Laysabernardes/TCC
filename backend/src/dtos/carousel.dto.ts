export interface CarrosselResponseType {
  _id: string;
  title: string;
  collection_type: "project" | "perspective";
  banner?: string;
  isCarrossel?: boolean;
  orderCarrossel?: number;
  extraURL?: string;
}
