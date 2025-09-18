import type { PeopleResponseType } from "../../people/components/people.types";

/**
 * @interface ProjectBase
 * @description Define a estrutura base com os campos comuns para um Projeto.
 * @exports
 */
export interface ProjectBase {
  title: string;
  subtitle?: string;
  slug: string;
  year: number;
  category: string[];
  about_html?: string;
  status: "draft" | "published";
  isCarousel?: boolean;
  orderCarousel?: number;
  banner?: string;
  extraURL?: string;
}

/**
 * @interface ProjectRequestType
 * @description Define a estrutura de dados enviada para a API ao criar/atualizar um Projeto.
 * @exports
 */
export interface ProjectRequestType extends ProjectBase {
  _id?: string;
  team?: string[]; // Ao enviar para a API, passamos um array de IDs (strings)
}

/**
 * @interface ProjectResponseType
 * @description Define a estrutura de dados recebida da API ao buscar um Projeto.
 * @exports
 */
export interface ProjectResponseType extends ProjectBase {
  _id: string;
  team: PeopleResponseType[]; // Ao receber da API, os dados da equipe vêm completos
  createdAt: Date;
  updatedAt: Date;
}