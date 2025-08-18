import { z } from "zod";
import { ProjectModel, IProject } from "../models/project.model";
import { ProjectResponseType } from "../dtos/project.dto";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../zod/schemas/project.schema";

type CreateProjectInput = z.infer<typeof createProjectSchema>["body"];
type UpdateProjectInput = z.infer<typeof updateProjectSchema>["body"];

const toProjectResponse = (project: any): ProjectResponseType => {
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
    isCarrossel: !!project.carousel,
    orderCarrossel: project.carousel?.order,
    banner: project.carousel?.banner_url,
    extraURL: project.carousel?.extra_url,
  };
};

export class ProjectService {
  private static transformInputForDatabase(
    input: CreateProjectInput | UpdateProjectInput
  ) {
    const {
      isCarrossel,
      orderCarrossel,
      banner,
      extraURL,
      ...restOfInput // Pega o resto dos campos (project_title, etc.)
    } = input;

    const dataForDatabase: any = { ...restOfInput };

    if (isCarrossel === true) {
      // Se for true, monta o objeto aninhado
      dataForDatabase.project_carousel = {
        order: orderCarrossel,
        banner_url: banner,
        extra_url: extraURL,
      };
    } else if (isCarrossel === false) {
      dataForDatabase.project_carousel = undefined;
    }

    return dataForDatabase;
  }

  static async create(input: CreateProjectInput): Promise<ProjectResponseType> {
    try {
      if (input.isCarrossel && input.orderCarrossel !== undefined) {
        const orderExists = await ProjectModel.findOne({
          "project_carousel.order": input.orderCarrossel,
        });
        if (orderExists) {
          throw new Error(
            `Order ${input.orderCarrossel} is already in use by another project.`
          );
        }
      }
      const dataForDatabase = this.transformInputForDatabase(input);
      const project = await ProjectModel.create(dataForDatabase);
      return toProjectResponse(project.toObject());
    } catch (error: any) {
      if (error.code === 11000 && error.keyPattern?.project_slug) {
        throw new Error("This slug is already in use.");
      }
      throw error;
    }
  }

  static async update(
    id: string,
    input: UpdateProjectInput
  ): Promise<ProjectResponseType | null> {
    if (input.isCarrossel && input.orderCarrossel !== undefined) {
      // Encontra um projeto que usa a mesma ordem, mas que NÃO SEJA o projeto que estamos editando
      const orderExists = await ProjectModel.findOne({
        "project_carousel.order": input.orderCarrossel,
        _id: { $ne: id }, // $ne = "not equal" (diferente de)
      });
      if (orderExists) {
        throw new Error(
          `A ordem ${input.orderCarrossel} já está em uso por outro projeto.`
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

  static async findBySlug(
    project_slug: string
  ): Promise<ProjectResponseType | null> {
    const project = await ProjectModel.findOne({ project_slug })
      .populate("project_team")
      .lean();
    if (!project) return null;
    return toProjectResponse(project);
  }

  static async findByStatus(
    status: "draft" | "published"
  ): Promise<ProjectResponseType[]> {
    const projects = await ProjectModel.find({ project_status: status }).lean();
    return projects.map(toProjectResponse);
  }

  static async findCarouselItems(): Promise<ProjectResponseType[]> {
    const projects = await ProjectModel.find({
      project_carousel: { $exists: true },
    }).lean();
    return projects.map(toProjectResponse);
  }

  static async findCarouselItemsSorted(): Promise<ProjectResponseType[]> {
    const projects = await ProjectModel.find({
      project_carousel: { $exists: true },
    })
      .sort({ "project_carousel.order": 1 }) // Ordena pela ordem do carrossel
      .lean();
    return projects.map(toProjectResponse);
  }

  static async findWithBanner(): Promise<ProjectResponseType[]> {
    const projects = await ProjectModel.find({
      "project_carousel.banner_url": { $exists: true, $ne: null },
    }).lean();
    return projects.map(toProjectResponse);
  }

  static async findWithExtraUrl(): Promise<ProjectResponseType[]> {
    const projects = await ProjectModel.find({
      "project_carousel.extra_url": { $exists: true, $ne: null },
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
