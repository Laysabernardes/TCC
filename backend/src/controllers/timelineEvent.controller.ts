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
import { TimelineEventService } from '../services/timelineEvent.service';
import { TimelineEventResponseType } from '../dtos/timelineEvent.dto';
import { createTimelineEventSchema, updateTimelineEventSchema } from '../zod/schemas/timelineEvent.schema';

type CreateTimelineEventInput = z.infer<typeof createTimelineEventSchema>['body'];
type UpdateTimelineEventInput = z.infer<typeof updateTimelineEventSchema>['body'];


@Tags("Timeline") 
@Route("") 
export class TimelineEventController extends Controller {

  @Post("/projects/{projectId}/timeline")
  @SuccessResponse("201", "Created")
  @Security("jwt")
  public async createTimelineEvent(
    @Path() projectId: string,
    @Body() body: CreateTimelineEventInput
  ): Promise<TimelineEventResponseType> {
    body.projectId = projectId;
    const event = await TimelineEventService.create(body);
    this.setStatus(201);
    return event;
  }

  @Get("/projects/{projectId}/timeline")
  public async getTimelineEventsForProject(
    @Path() projectId: string
  ): Promise<TimelineEventResponseType[]> {
    return await TimelineEventService.findByProjectId(projectId);
  }

  @Get("/timeline/{timelineEventId}")
  @Response("404", "Not Found")
  public async getTimelineEventById(
    @Path() timelineEventId: string
  ): Promise<TimelineEventResponseType> {
    const event = await TimelineEventService.findById(timelineEventId);
    if (!event) {
      this.setStatus(404);
      return { message: "Evento não encontrado" } as any;
    }
    return event;
  }
  
  @Put("/timeline/{timelineEventId}")
  @Response("404", "Not Found")
  @Security("jwt")
  public async updateTimelineEvent(
    @Path() timelineEventId: string,
    @Body() body: UpdateTimelineEventInput
  ): Promise<TimelineEventResponseType> {
    const updatedEvent = await TimelineEventService.update(timelineEventId, body);
    if (!updatedEvent) {
      this.setStatus(404);
      return { message: "Evento não encontrado para atualizar" } as any;
    }
    return updatedEvent;
  }

  @Delete("/timeline/{timelineEventId}")
  @SuccessResponse("204", "No Content")
  @Response("404", "Not Found")
  @Security("jwt")
  public async deleteTimelineEvent(
    @Path() timelineEventId: string
  ): Promise<void> {
    try {
      await TimelineEventService.delete(timelineEventId);
      this.setStatus(204);
    } catch (error: any) {
      this.setStatus(404);
      throw error;
    }
  }
}