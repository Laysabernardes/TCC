import { Schema } from "mongoose";

export interface ICarousel {
  orderCarousel: number;
  extraURL?: string;
}

export const carouselSchema = new Schema<ICarousel>(
  {
    orderCarousel: { type: Number, required: true, default: 0 },
    extraURL: { type: String, required: false },
  },
  {
    _id: false, // para não criar um _id para o sub-objeto
  }
);
