import { z } from "zod";
import { ProjectModel, IProject } from "../models/project.model";
import { ProjectResponseType } from "../dtos/project.dto";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../zod/schemas/project.schema";

type CreateProjectInput = z.infer<typeof createProjectSchema>["body"];
type UpdateProjectInput = z.infer<typeof updateProjectSchema>["body"];

const toProjectResponse = (project: IProject | any): ProjectResponseType => {
  return {
    _id: project._id.toString(),
    title: project.title,
    subtitle: project.subtitle,
    slug: project.slug,
    about_html: project.about_html,
    team: project.team,
    status: project.status,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    isCarousel: project.isCarousel,
    orderCarousel: project.orderCarousel,
    banner: project.banner,
    extraURL: project.extraURL,
  };
};

export class ProjectService {
  private static transformInputForDatabase(
    input: CreateProjectInput | UpdateProjectInput
  ) {
    return { ...input };
  }

  static async create(input: CreateProjectInput): Promise<ProjectResponseType> {
    try {
      if (input.isCarousel && input.orderCarousel !== undefined) {
        const orderExists = await ProjectModel.findOne({
          orderCarousel: input.orderCarousel,
        });
        if (orderExists) {
          throw new Error(
            `Order ${input.orderCarousel} is already in use by another project.`
          );
        }
      }
      const dataForDatabase = this.transformInputForDatabase(input);
      const project = await ProjectModel.create(dataForDatabase);
      return toProjectResponse(project.toObject());
    } catch (error: any) {
      if (error.code === 11000 && error.keyPattern?.slug) {
        throw new Error("This slug is already in use.");
      }
      throw error;
    }
  }

  static async update(
    id: string,
    input: UpdateProjectInput
  ): Promise<ProjectResponseType | null> {
    if (input.isCarousel && input.orderCarousel !== undefined) {
      const orderExists = await ProjectModel.findOne({
        orderCarousel: input.orderCarousel,
        _id: { $ne: id },
      });
      if (orderExists) {
        throw new Error(
          `A ordem ${input.orderCarousel} já está em uso por outro projeto.`
        );
      }
    }
    const dataForDatabase = this.transformInputForDatabase(input);
    const project = await ProjectModel.findByIdAndUpdate(id, dataForDatabase, {
      new: true,
    }).lean();
    if (!project) return null;
    return toProjectResponse(project);
  }

  static async findAll(): Promise<ProjectResponseType[]> {
    const projects = await ProjectModel.find().lean();
    return projects.map(toProjectResponse);
  }

  static async findBySlug(slug: string): Promise<ProjectResponseType | null> {
    const project = await ProjectModel.findOne({ slug })
      .populate("team")
      .lean();
    if (!project) return null;
    return toProjectResponse(project);
  }

  static async findByStatus(
    status: "draft" | "published"
  ): Promise<ProjectResponseType[]> {
    const projects = await ProjectModel.find({ status }).lean();
    return projects.map(toProjectResponse);
  }

  static async findCarouselItems(): Promise<ProjectResponseType[]> {
    const projects = await ProjectModel.find({ isCarousel: true }).lean();
    return projects.map(toProjectResponse);
  }

  static async findCarouselItemsSorted(): Promise<ProjectResponseType[]> {
    const projects = await ProjectModel.find({ isCarousel: true })
      .sort({ orderCarousel: 1 })
      .lean();
    return projects.map(toProjectResponse);
  }

  static async findWithBanner(): Promise<ProjectResponseType[]> {
    const projects = await ProjectModel.find({
      banner: { $exists: true, $ne: null },
    }).lean();
    return projects.map(toProjectResponse);
  }

  static async findWithExtraUrl(): Promise<ProjectResponseType[]> {
    const projects = await ProjectModel.find({
      extraURL: { $exists: true, $ne: null },
    }).lean();
    return projects.map(toProjectResponse);
  }

  static async delete(id: string): Promise<void> {
    const result = await ProjectModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new Error("Project not found to delete.");
    }
  }
}
