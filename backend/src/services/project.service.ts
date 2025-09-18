/**
 * @file project.service.ts
 * @description Contém a classe ProjectService, que encapsula a lógica de negócio
 * e a interação com o banco de dados para a entidade 'Project'.
 */
import { z } from "zod";
import { ProjectModel, IProject } from "../models/project.model";
import { ProjectResponseType } from "../dtos/project.dto";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../zod/schemas/project.schema";

type CreateProjectInput = z.infer<typeof createProjectSchema>["body"];
type UpdateProjectInput = z.infer<typeof updateProjectSchema>["body"];

/**
 * Transforma um documento Mongoose 'Project' em um objeto de resposta DTO.
 * @param {IProject | any} project O documento Mongoose do projeto.
 * @returns {ProjectResponseType} O objeto formatado para a resposta da API.
 */
const toProjectResponse = (project: IProject | any): ProjectResponseType => {
  return {
    _id: project._id.toString(),
    title: project.title,
    subtitle: project.subtitle,
    slug: project.slug,
    category: project.category,
    year: project.year,
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

/**
 * @class ProjectService
 * @description Classe estática que agrupa os métodos para manipular os 'Projects'.
 */
export class ProjectService {
  private static transformInputForDatabase(
    input: CreateProjectInput | UpdateProjectInput
  ) {
    return { ...input };
  }

  /**
   * Cria um novo projeto no banco de dados.
   * @param {CreateProjectInput} input Os dados do novo projeto, validados pelo Zod.
   * @returns {Promise<ProjectResponseType>} O projeto recém-criado.
   * @throws {AppError} Lança um erro se o slug ou a ordem do carrossel já estiverem em uso.
   */
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

  /**
   * Cria um novo projeto no banco de dados.
   * @param {CreateProjectInput} input Os dados do novo projeto, validados pelo Zod.
   * @returns {Promise<ProjectResponseType>} O projeto recém-criado.
   * @throws {AppError} Lança um erro se o slug ou a ordem do carrossel já estiverem em uso.
   */
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

  /**
   * Busca todos os projetos.
   * @returns {Promise<ProjectResponseType[]>} Um array com todos os projetos.
   */
  static async findAll(): Promise<ProjectResponseType[]> {
    const projects = await ProjectModel.find().lean();
    return projects.map(toProjectResponse);
  }

  /**
   * Busca um projeto único pelo seu slug.
   * @param {string} slug O slug do projeto.
   * @returns {Promise<ProjectResponseType | null>} O projeto encontrado ou nulo.
   */
  static async findBySlug(slug: string): Promise<ProjectResponseType | null> {
    const project = await ProjectModel.findOne({ slug })
      .populate("team")
      .lean();
    if (!project) return null;
    return toProjectResponse(project);
  }

  /**
   * Busca todos os projetos que contêm uma categoria específica.
   * @param {string} category A categoria para filtrar.
   * @returns {Promise<ProjectResponseType[]>} Um array de projetos.
   */
  static async findByStatus(
    status: "draft" | "published"
  ): Promise<ProjectResponseType[]> {
    const projects = await ProjectModel.find({ status }).lean();
    return projects.map(toProjectResponse);
  }

  /**
    * Busca todos os projetos que estão marcados para aparecer no carrossel.
    * A ordem de retorno não é garantida.
    * @returns {Promise<ProjectResponseType[]>} Um array com os projetos do carrossel.
    */
  static async findCarouselItems(): Promise<ProjectResponseType[]> {
    const projects = await ProjectModel.find({ isCarousel: true }).lean();
    return projects.map(toProjectResponse);
  }

  /**
    * Busca todos os projetos do carrossel e os retorna em ordem crescente.
    * Utiliza o campo `orderCarousel` para a ordenação.
    * @returns {Promise<ProjectResponseType[]>} Um array ordenado com os projetos do carrossel.
    */
  static async findCarouselItemsSorted(): Promise<ProjectResponseType[]> {
    const projects = await ProjectModel.find({ isCarousel: true })
      .sort({ orderCarousel: 1 })
      .lean();
    return projects.map(toProjectResponse);
  }
  /**
    * Busca todos os projetos que possuem uma imagem de banner definida.
    * @returns {Promise<ProjectResponseType[]>} Um array com os projetos que têm banner.
    */
  static async findWithBanner(): Promise<ProjectResponseType[]> {
    const projects = await ProjectModel.find({
      banner: { $exists: true, $ne: null },
    }).lean();
    return projects.map(toProjectResponse);
  }

  /**
  * Busca todos os projetos que possuem uma URL extra definida.
  * @returns {Promise<ProjectResponseType[]>} Um array com os projetos que têm a URL extra.
  */
  static async findWithExtraUrl(): Promise<ProjectResponseType[]> {
    const projects = await ProjectModel.find({
      extraURL: { $exists: true, $ne: null },
    }).lean();
    return projects.map(toProjectResponse);
  }

  /**
   * Deleta um projeto pelo seu ID.
   * @param {string} id O ID do projeto a ser deletado.
   * @returns {Promise<void>}
   * @throws {AppError} Lança um erro se o projeto não for encontrado.
   */
  static async delete(id: string): Promise<void> {
    const result = await ProjectModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new Error("Project not found to delete.");
    }
  }

  /**
   * Busca todos os projetos que pertencem a uma categoria específica.
   * @param category A categoria para filtrar os projetos.
   * @returns {Promise<ProjectResponseType[]>} Um array com os projetos encontrados.
   */
  static async findByCategory(category: string): Promise<ProjectResponseType[]> {
    const projects = await ProjectModel.find({ category }).lean();
    return projects.map(toProjectResponse);
  }
}
