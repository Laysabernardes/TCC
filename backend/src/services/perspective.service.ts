// src/services/perspective.service.ts

import { z } from 'zod';
import { PerspectiveModel } from '../models/perspective.model';
import { PerspectiveResponseType } from '../dtos/perspective.dto';
import { createPerspectiveSchema, updatePerspectiveSchema } from '../zod/schemas/perspective.schema';

// Tipos inferidos do Zod para os corpos das requisições
type CreatePerspectiveInput = z.infer<typeof createPerspectiveSchema>['body'];
type UpdatePerspectiveInput = z.infer<typeof updatePerspectiveSchema>['body'];

const toPerspectiveResponse = (perspective: any): PerspectiveResponseType => {
  return {
    ...perspective,
    _id: perspective._id.toString(),
    projectId: perspective.projectId.toString(),
    // Garante que os autores sejam um array, mesmo que venha nulo/undefined
    authors: perspective.authors || [],
  };
};

export class PerspectiveService {

  static async create(input: CreatePerspectiveInput): Promise<PerspectiveResponseType> {
    try {
      const perspective = await PerspectiveModel.create(input);
      await perspective.populate({ path: 'authors', model: 'Person' });
      return toPerspectiveResponse(perspective.toObject());
    } catch (error: any) {
      if (error.code === 11000 && error.keyPattern?.slug) {
        throw new Error('Este slug de perspectiva já está em uso.');
      }
      throw error;
    }
  }

  static async findByProjectId(projectId: string): Promise<PerspectiveResponseType[]> {
    const perspectives = await PerspectiveModel.find({ projectId })
      .populate('authors') 
      .lean();
    return perspectives.map(toPerspectiveResponse);
  }

  static async findById(id: string): Promise<PerspectiveResponseType | null> {
    const perspective = await PerspectiveModel.findById(id).populate('authors').lean();
    if (!perspective) return null;
    return toPerspectiveResponse(perspective);
  }

  static async update(id: string, input: UpdatePerspectiveInput): Promise<PerspectiveResponseType | null> {
    const perspective = await PerspectiveModel.findByIdAndUpdate(id, input, { new: true })
      .populate('authors')
      .lean();
    if (!perspective) return null;
    return toPerspectiveResponse(perspective);
  }

  static async delete(id: string): Promise<void> {
    const result = await PerspectiveModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new Error("Perspectiva não encontrada para deletar.");
    }
  }
}