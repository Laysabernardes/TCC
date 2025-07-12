import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Route,
  SuccessResponse,
  Tags,
  Response,
  Security
} from 'tsoa';
import { z } from 'zod';
import { PerspectiveService } from '../services/perspective.service';
import { PerspectiveResponseType } from '../dtos/perspective.dto';
import { createPerspectiveSchema, updatePerspectiveSchema } from '../zod/schemas/perspective.schema';

// Tipos inferidos do Zod
type CreatePerspectiveInput = z.infer<typeof createPerspectiveSchema>['body'];
type UpdatePerspectiveInput = z.infer<typeof updatePerspectiveSchema>['body'];

@Tags("Perspectives") 
@Route("") 
export class PerspectiveController extends Controller {

  @Post("/projects/{projectId}/perspectives")
  @SuccessResponse("201", "Created")
  @Security("jwt")
  public async createPerspective(
    @Path() projectId: string,
    @Body() body: CreatePerspectiveInput
  ): Promise<PerspectiveResponseType> {
    // Garantimos que o projectId do corpo da requisição seja o mesmo da URL
    body.projectId = projectId;
    const perspective = await PerspectiveService.create(body);
    this.setStatus(201);
    return perspective;
  }

  @Get("/projects/{projectId}/perspectives")
  public async getPerspectivesForProject(
    @Path() projectId: string
  ): Promise<PerspectiveResponseType[]> {
    return await PerspectiveService.findByProjectId(projectId);
  }

  @Get("/perspectives/{perspectiveId}")
  @Response("404", "Not Found")
  @Security("jwt")
  public async getPerspectiveById(
    @Path() perspectiveId: string
  ): Promise<PerspectiveResponseType> {
    const perspective = await PerspectiveService.findById(perspectiveId);
    if (!perspective) {
      this.setStatus(404);
      return { message: "Perspectiva não encontrada" } as any;
    }
    return perspective;
  }
  
  @Put("/perspectives/{perspectiveId}")
  @Response("404", "Not Found")
  @Security("jwt")
  public async updatePerspective(
    @Path() perspectiveId: string,
    @Body() body: UpdatePerspectiveInput
  ): Promise<PerspectiveResponseType> {
    const updatedPerspective = await PerspectiveService.update(perspectiveId, body);
    if (!updatedPerspective) {
      this.setStatus(404);
      return { message: "Perspectiva não encontrada para atualizar" } as any;
    }
    return updatedPerspective;
  }

  @Delete("/perspectives/{perspectiveId}")
  @SuccessResponse("204", "No Content")
  @Response("404", "Not Found")
  @Security("jwt")
  public async deletePerspective(
    @Path() perspectiveId: string
  ): Promise<void> {
    try {
      await PerspectiveService.delete(perspectiveId);
      this.setStatus(204);
    } catch (error: any) {
      this.setStatus(404);
      throw error; 
    }
  }
}