/**
 * @file perspective.service.ts
 * @description Este arquivo contém a classe PerspectiveService, que encapsula toda a lógica de negócio
 * e interação com o banco de dados para a entidade 'Perspective'.
 */

import { z } from "zod";
import { PerspectiveModel, IPerspective } from "../models/perspective.model";
import { PerspectiveResponseType } from "../dtos/perspective.dto";
import {
  createPerspectiveSchema,
  updatePerspectiveSchema,
} from "../zod/schemas/perspective.schema";

// Tipos inferidos do Zod para garantir a tipagem correta dos inputs.
type CreatePerspectiveInput = z.infer<typeof createPerspectiveSchema>["body"];
type UpdatePerspectiveInput = z.infer<typeof updatePerspectiveSchema>["body"];

/**
 * Transforma um documento Mongoose 'Perspective' em um objeto de resposta DTO.
 * Converte ObjectIds em strings para ser amigável ao cliente (JSON).
 * @param {IPerspective} perspective - O documento Mongoose retornado do banco de dados.
 * @returns {PerspectiveResponseType} - O objeto formatado para a resposta da API.
 */
const toPerspectiveResponse = (perspective: any): PerspectiveResponseType => {
  return {
    ...perspective,
    _id: perspective._id.toString(),
    projectId: perspective.projectId.toString(),
    // Garante que os autores sejam um array, mesmo que venha nulo/undefined
    authors: perspective.authors || [],
  };
};

/**
 * @class PerspectiveService
 * @description Classe estática que agrupa os métodos para manipular as 'Perspectives'.
 */
export class PerspectiveService {
  /**
   * Cria uma nova perspectiva no banco de dados.
   * @param {CreatePerspectiveInput} input - Os dados da nova perspectiva, validados pelo Zod schema.
   * @returns {Promise<PerspectiveResponseType>} A perspectiva recém-criada.
   * @throws {Error} Lança um erro 
   */
  static async create(
    input: CreatePerspectiveInput
  ): Promise<PerspectiveResponseType> {
    try {
      const perspective = await PerspectiveModel.create(input);
      // Popula os dados dos autores para retornar o objeto completo.
      await perspective.populate({ path: "authors", model: "Person" });
      return toPerspectiveResponse(perspective.toObject());
    } catch (error: any) {
      // Tratamento de erro específico para chave única (slug duplicado).
      if (error.code === 11000 && error.keyPattern?.slug) {
        throw new Error("Este slug de perspectiva já está em uso.");
      }
       if (error.code === 11000 && error.keyPattern?.projectId && error.keyPattern?.order) {
        throw new Error("Este número de ordem já está em uso para este projeto.");
      }
      throw error;
    }
  }

  /**
   * Busca todas as perspectivas do banco de dados.
   * @returns {Promise<PerspectiveResponseType[]>} Um array com todas as perspectivas.
   */
  static async findAll(): Promise<PerspectiveResponseType[]> {
    const perspectives = await PerspectiveModel.find().lean();
    return perspectives.map(toPerspectiveResponse);
  }

  /**
   * Busca todas as perspectivas associadas a um ID de projeto específico.
   * @param {string} projectId - O ID do projeto pai.
   * @returns {Promise<PerspectiveResponseType[]>} Um array com as perspectivas encontradas.
   */
  static async findByProjectId(
    projectId: string
  ): Promise<PerspectiveResponseType[]> {
    const perspectives = await PerspectiveModel.find({ projectId })
      .populate("authors")
      .lean();
    return perspectives.map(toPerspectiveResponse);
  }

  /**
   * Busca uma única perspectiva pelo seu ID.
   * @param {string} id - O ID da perspectiva a ser encontrada.
   * @returns {Promise<PerspectiveResponseType | null>} A perspectiva encontrada ou nulo se não existir.
   */
  static async findById(id: string): Promise<PerspectiveResponseType | null> {
    const perspective = await PerspectiveModel.findById(id)
      .populate("authors")
      .lean();
    if (!perspective) return null;
    return toPerspectiveResponse(perspective);
  }

  /**
   * Busca uma perspectiva única pelo seu slug.
   * @param {string} slug O slug da perspectiva.
   * @returns {Promise<PerspectiveResponseType | null>} A perspectiva encontrada ou nulo.
   */
   static async findBySlug(slug: string): Promise<PerspectiveResponseType | null> {
     const perspective = await PerspectiveModel.findOne({ slug })
       .populate("authors")
       .populate("projectId")
       .lean();
     if (!perspective) return null;
     return toPerspectiveResponse(perspective);
   }
  /**
   * Atualiza uma perspectiva existente pelo seu ID.
   * @param {string} id - O ID da perspectiva a ser atualizada.
   * @param {UpdatePerspectiveInput} input - Os novos dados para a perspectiva.
   * @returns {Promise<PerspectiveResponseType | null>} A perspectiva atualizada ou nulo se não for encontrada.
   */
  static async update(
    id: string,
    input: UpdatePerspectiveInput
  ): Promise<PerspectiveResponseType | null> {
    const perspective = await PerspectiveModel.findByIdAndUpdate(id, input, {
      new: true, // Garante que o método retorne o documento já atualizado.
    })
      .populate("authors")
      .lean();
    if (!perspective) return null;
    return toPerspectiveResponse(perspective);
  }

  /**
   * Deleta uma perspectiva pelo seu ID.
   * @param {string} id - O ID da perspectiva a ser deletada.
   * @returns {Promise<void>}
   * @throws {Error} Lança um erro se nenhuma perspectiva com o ID fornecido for encontrada.
   */
  static async delete(id: string): Promise<void> {
    const result = await PerspectiveModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new Error("Perspectiva não encontrada para deletar.");
    }
  }
}