export interface CarouselResponseType {
  _id: string;
  title: string;
  collection_type: "project" | "perspective";
  banner?: string;
  isCarousel?: boolean;
  orderCarousel?: number;
  extraURL?: string;
}
