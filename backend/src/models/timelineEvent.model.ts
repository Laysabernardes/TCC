// src/models/timelineEvent.model.ts

import { Schema, model, Document } from 'mongoose';

export interface ITimelineEvent extends Document {
  projectId: Schema.Types.ObjectId;

  title: string;
  order: number;
  description_html: string;
  imageUrl: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const timelineEventSchema = new Schema<ITimelineEvent>({

  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },

  title: { type: String, required: true },
  order: { type: Number, default: 0 },
  description_html: { type: String, default: '' },
  imageUrl: { type: String, default: '' }
}, { timestamps: true });


export const TimelineEventModel = model<ITimelineEvent>('TimelineEvent', timelineEventSchema);