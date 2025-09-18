/**
 * @file project.service.ts
 * @description Contém todos os métodos para interagir com a API de Projetos.
 */

import api from "../../lib/api"; // Importa a instância central do Axios
import type { ProjectRequestType, ProjectResponseType } from "./components/project.types";

/**
 * @class ProjectService
 * @description Classe estática que agrupa as chamadas de API para a entidade 'Project'.
 */
export class ProjectService {
  /**
   * Busca todos os projetos.
   * O token é adicionado automaticamente pelo interceptor do Axios em `api.ts`.
   * @returns {Promise<ProjectResponseType[]>} Uma lista de todos os projetos.
   */
  static async getAllProjects(): Promise<ProjectResponseType[]> {
    const response = await api.get('/projects');
    return response.data;
  }

  /**
   * Busca um único projeto pelo seu slug.
   * @param {string} slug - O slug do projeto a ser buscado.
   * @returns {Promise<ProjectResponseType>} O projeto encontrado.
   */
  static async getBySlug(slug: string): Promise<ProjectResponseType> {
    const response = await api.get(`/projects/${slug}`);
    return response.data;
  }
  
  /**
   * Busca todos os projetos que pertencem a uma categoria específica.
   * @param {string} category - A categoria para filtrar.
   * @returns {Promise<ProjectResponseType[]>} Uma lista de projetos da categoria especificada.
   */
  static async getByCategory(category: string): Promise<ProjectResponseType[]> {
    const response = await api.get(`/projects/category/${category}`);
    return response.data;
  }

  /**
   * Cria um novo projeto.
   * @param {ProjectRequestType} data - Os dados do projeto a ser criado.
   * @returns {Promise<ProjectResponseType>} O projeto recém-criado.
   */
  static async create(data: ProjectRequestType): Promise<ProjectResponseType> {
    const response = await api.post('/projects', data);
    return response.data;
  }

  /**
   * Atualiza um projeto existente.
   * @param {string} id - O ID do projeto a ser atualizado.
   * @param {Partial<ProjectRequestType>} data - Os dados do projeto a serem atualizados.
   * @returns {Promise<ProjectResponseType>} O projeto atualizado.
   */
  static async update(id: string, data: Partial<ProjectRequestType>): Promise<ProjectResponseType> {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  }

  /**
   * Deleta um projeto.
   * @param {string} id - O ID do projeto a ser deletado.
   * @returns {Promise<void>}
   */
  static async delete(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  }
}