// src/features/projects/project.types.ts
import type { PeopleResponseType } from "../../people/components/people.types";

/**
 * @interface ProjectBase
 * @description Define a estrutura base com os campos comuns entre a requisição e a resposta de um Projeto.
 */
export interface ProjectBase {
  title: string;
  subtitle?: string;
  slug: string;
  year: number;
  categories: string[];
  about_html?: string;
  status: "draft" | "published";
  isCarousel?: boolean;
  orderCarousel?: number;
  banner?: string;
  extraURL?: string;
}

/**
 * @interface ProjectRequest
 * @description Define a estrutura de dados enviada para a API ao criar/atualizar um Projeto.
 * Herda de ProjectBase e usa IDs para as associações.
 */
export interface ProjectRequest extends ProjectBase {
  _id?: string;
  team?: string[]; // Ao enviar, passamos apenas os IDs
}

/**
 * @interface ProjectResponseType
 * @description Define a estrutura de dados recebida da API ao buscar um Projeto.
 * Herda de ProjectBase e tem os dados de 'team' populados.
 */
export interface ProjectResponseType extends ProjectBase {
  _id: string;
  team: PeopleResponseType[]; // Ao receber, os dados da equipe vêm completos
  createdAt: Date;
  updatedAt: Date;
}