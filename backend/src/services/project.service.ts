import { z } from 'zod';
import { ProjectModel } from '../models/project.model';
import { ProjectResponseType } from '../dtos/project.dto'; 
import { createProjectSchema } from '../zod/schemas/project.schema';

type CreateProjectInput = z.infer<typeof createProjectSchema>['body'];

export class ProjectService {
  static async createProject(input: CreateProjectInput): Promise<ProjectResponseType> {
    try {
      const project = await ProjectModel.create(input);
      return project.toObject() as ProjectResponseType; 

    } catch (error: any) {
      if (error.code === 11000 && error.keyPattern?.slug) {
        throw new Error('Este slug já está em uso.');
      }
      throw error;
    }
  }
}