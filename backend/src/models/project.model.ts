import { Schema, model, Document } from "mongoose";
import { IPerson } from "./person.model";
import { ICarousel, carouselSchema } from "./carousel.model";

export interface IProject extends Document {
  title: string;
  subtitle: string;
  slug: string;
  about_html: string;
  team: (IPerson["_id"] | IPerson)[];
  status: "draft" | "published";
  isCarousel?: boolean;
  orderCarousel?: number;
  extraURL?: string;
  // carousel?: ICarousel;
  banner: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    slug: { type: String, required: true, unique: true, index: true },
    about_html: { type: String, default: "" },
    team: [{ type: Schema.Types.ObjectId, ref: "Person" }],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    isCarousel: { type: Boolean, default: false },
    orderCarousel: { type: Number, required: false },
    extraURL: { type: String, required: false },
    // carousel: {
    //   type: carouselSchema,
    //   required: false,
    // },
    banner: { type: String },
  },
  { timestamps: true }
);

projectSchema.index(
  { orderCarousel: 1 },
  {
    unique: true,
    partialFilterExpression: { orderCarousel: { $exists: true } },
  }
);

export const ProjectModel = model<IProject>("Project", projectSchema);
