import { Body, Controller, Delete, Get, Path, Post, Put, Route, SuccessResponse, Tags, Response, Security} from 'tsoa';
import { z } from 'zod';
import { ProjectService } from '../services/project.service';
import { ProjectResponseType } from '../dtos/project.dto';
import { createProjectSchema, updateProjectSchema } from '../zod/schemas/project.schema';

type CreateProjectInput = z.infer<typeof createProjectSchema>['body'];
type UpdateProjectInput = z.infer<typeof updateProjectSchema>['body'];

@Route("projects")
@Tags("Projects")
export class ProjectController extends Controller {

  @Post("/")
  @SuccessResponse("201", "Created")
  @Response("409", "Conflict")
  @Security("jwt")
  public async createProject(@Body() body: CreateProjectInput): Promise<ProjectResponseType> {
    try {
      const project = await ProjectService.create(body);
      this.setStatus(201);
      return project;
    } catch (error: any) {
      this.setStatus(409);
      return { message: error.message } as any;
    }
  }

  @Get("/")
  public async getAllProjects(): Promise<ProjectResponseType[]> {
    return await ProjectService.findAll();
  }

  @Get("{slug}")
  @Response("404", "Not Found")
  public async getProjectBySlug(@Path() slug: string): Promise<ProjectResponseType> {
    const project = await ProjectService.findBySlug(slug);
    if (!project) {
      this.setStatus(404);
      return { message: "Projeto não encontrado" } as any;
    }
    return project;
  }

  @Put("{id}")
  @Response("404", "Not Found")
  @Security("jwt")
  public async updateProject(@Path() id: string, @Body() body: UpdateProjectInput): Promise<ProjectResponseType> {
    const updatedProject = await ProjectService.update(id, body);
    if (!updatedProject) {
      this.setStatus(404);
      return { message: "Projeto não encontrado para atualizar" } as any;
    }
    return updatedProject;
  }

  @Delete("{id}")
  @SuccessResponse("204", "No Content")
  @Response("404", "Not Found")
  @Security("jwt")
  public async deleteProject(@Path() id: string): Promise<void> {
    try {
      await ProjectService.delete(id);
      this.setStatus(204);
    } catch (error: any) {
      this.setStatus(404);
      console.error(error); // Log do erro
    }
  }
}