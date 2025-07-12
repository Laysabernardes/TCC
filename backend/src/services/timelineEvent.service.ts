import { z } from 'zod';
import { TimelineEventModel } from '../models/timelineEvent.model';
import { TimelineEventResponseType } from '../dtos/timelineEvent.dto';
import { createTimelineEventSchema, updateTimelineEventSchema } from '../zod/schemas/timelineEvent.schema';

type CreateTimelineEventInput = z.infer<typeof createTimelineEventSchema>['body'];
type UpdateTimelineEventInput = z.infer<typeof updateTimelineEventSchema>['body'];

const toTimelineEventResponse = (event: any): TimelineEventResponseType => {
  return {
    ...event,
    _id: event._id.toString(),
    projectId: event.projectId.toString(),
  };
};

export class TimelineEventService {

  static async create(input: CreateTimelineEventInput): Promise<TimelineEventResponseType> {
    const event = await TimelineEventModel.create(input);
    return toTimelineEventResponse(event.toObject());
  }

  static async findByProjectId(projectId: string): Promise<TimelineEventResponseType[]> {
    const events = await TimelineEventModel.find({ projectId }).sort({ order: 1 }).lean();
    return events.map(toTimelineEventResponse);
  }

  static async findById(id: string): Promise<TimelineEventResponseType | null> {
    const event = await TimelineEventModel.findById(id).lean();
    if (!event) return null;
    return toTimelineEventResponse(event);
  }

  static async update(id: string, input: UpdateTimelineEventInput): Promise<TimelineEventResponseType | null> {
    const event = await TimelineEventModel.findByIdAndUpdate(id, input, { new: true }).lean();
    if (!event) return null;
    return toTimelineEventResponse(event);
  }

  static async delete(id: string): Promise<void> {
    const result = await TimelineEventModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new Error("Evento da linha do tempo não encontrado para deletar.");
    }
  }
}