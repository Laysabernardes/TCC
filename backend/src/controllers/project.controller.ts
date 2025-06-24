// src/controllers/project.controller.ts

import {
  Body,
  Controller,
  Post,
  Route,
  SuccessResponse,
  Tags,
  Response,
} from 'tsoa';
import { z } from 'zod';

import { ProjectService } from '../services/project.service';
import { ProjectResponseType } from '../dtos/project.dto'; 
import { createProjectSchema } from '../zod/schemas/project.schema';

type CreateProjectInput = z.infer<typeof createProjectSchema>['body'];

@Route("api/projects")
@Tags("Projects")
export class ProjectController extends Controller {

  @Post("/")
  @SuccessResponse("201", "Created")
  @Response("409", "Conflict - Slug já está em uso")
  public async createProject(
    @Body() requestBody: CreateProjectInput
  ): Promise<ProjectResponseType> {

    try {
      const project = await ProjectService.createProject(requestBody);

      this.setStatus(201);
      return project; 

    } catch (error: any) {
        if (error.message === 'Este slug já está em uso.') {
            this.setStatus(409);
            return { message: error.message } as any;
        }
        throw error;
    }
  }
}