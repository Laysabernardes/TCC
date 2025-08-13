import { Schema, model, Document } from "mongoose";
import { IPerson } from "./person.model";

interface ICarousel {
  order: number;
  banner_url: string;
  extra_url?: string;
}
export interface IProject extends Document {
  project_title: string;
  project_subtitle: string;
  project_slug: string;
  project_about_html: string;
  project_team: (IPerson["_id"] | IPerson)[];
  project_status: "draft" | "published";
  project_carousel?: ICarousel;
  createdAt: Date;
  updatedAt: Date;
}

const carouselSchema = new Schema<ICarousel>(
  {
    order: { type: Number, required: true, default: 0 },
    banner_url: { type: String, required: true },
    extra_url: { type: String, required: false },
  },
  {
    _id: false, // para não criar um _id para o sub-objeto
  }
);

const projectSchema = new Schema<IProject>(
  {
    project_title: { type: String, required: true },
    project_subtitle: { type: String },
    project_slug: { type: String, required: true, unique: true, index: true },
    project_about_html: { type: String, default: "" },
    project_team: [{ type: Schema.Types.ObjectId, ref: "Person" }],
    project_status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    project_carousel: {
      type: carouselSchema,
      required: false,
    },
  },
  { timestamps: true }
);

projectSchema.index(
  { "project_carousel.order": 1 },
  {
    unique: true,
    partialFilterExpression: { project_carousel: { $exists: true } },
  }
);

export const ProjectModel = model<IProject>("Project", projectSchema);
