import { z } from 'zod';
import { ProjectModel, IProject } from '../models/project.model';
import { ProjectResponseType } from '../dtos/project.dto';
import { createProjectSchema, updateProjectSchema } from '../zod/schemas/project.schema';

type CreateProjectInput = z.infer<typeof createProjectSchema>['body'];
type UpdateProjectInput = z.infer<typeof updateProjectSchema>['body'];

// Função auxiliar para converter o documento Mongoose para nosso DTO
const toProjectResponse = (project: any): ProjectResponseType => {
  return {
     _id: project._id.toString(),
    project_name: project.project_name,
    project_slug: project.project_slug,
    project_about_html: project.project_about_html,
    project_team: project.project_team,
    project_createdAt: project.createdAt, 
    project_updatedAt: project.updatedAt,
  };
};

export class ProjectService {
  // --- CRIAR ---
  static async create(input: CreateProjectInput): Promise<ProjectResponseType> {
    try {
      const project = await ProjectModel.create(input);
      return toProjectResponse(project.toObject());
    } catch (error: any) {
      if (error.code === 11000 && error.keyPattern?.project_slug) {
        throw new Error('Este slug já está em uso.');
      }
      throw error;
    }
  }

  // --- BUSCAR TODOS ---
  static async findAll(): Promise<ProjectResponseType[]> {
    const projects = await ProjectModel.find().lean();
    return projects.map(toProjectResponse);
  }

  // --- BUSCAR UM POR SLUG ---
  static async findBySlug(project_slug: string): Promise<ProjectResponseType | null> {
    const project = await ProjectModel.findOne({ project_slug })
      .populate('project_team') 
      .lean();
    
    if (!project) return null;
    return toProjectResponse(project);
  }

  // --- ATUALIZAR ---
  static async update(id: string, input: UpdateProjectInput): Promise<ProjectResponseType | null> {
    const project = await ProjectModel.findByIdAndUpdate(id, input, { new: true }).lean();
    
    if (!project) return null;

    return toProjectResponse(project);
  }

  // --- DELETAR ---
  static async delete(id: string): Promise<void> {
    const result = await ProjectModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new Error("Projeto não encontrado para deletar.");
    }
  }
}