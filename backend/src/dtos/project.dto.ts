import { PersonResponseType } from "./person.dto";

/**
 * @interface ProjectResponseType
 * @description Define a estrutura de dados de um "Projeto" como ela é enviada
 * pela API para o cliente (frontend).
 * @exports
 */
export interface ProjectResponseType {
  /**
   * O identificador único do projeto no banco de dados.
   * @type {string}
   */
  _id: string;

  title: string;
  subtitle: string
  slug: string;
  category: string;
  year: number;
  about_html: string;
  team: PersonResponseType[];
  status: "draft" | "published";
  /**
   * Flag booleana que indica se o projeto deve aparecer no carrossel principal.
   * @type {boolean}
   * @optional
   */
  isCarousel?: boolean;
  /**
   * O número que define a ordem de exibição do projeto no carrossel.
   * @type {number}
   * @optional
   */
  orderCarousel?: number;
  /**
   * A URL da imagem principal (banner) do projeto.
   * @type {string}
   * @optional
   */
  banner?: string;
  /**
   * Uma URL adicional que pode ser usada para um link específico no carrossel.
   * @type {string}
   * @optional
   */
  extraURL?: string;
  createdAt: Date;
  updatedAt: Date;
}