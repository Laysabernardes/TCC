import api from "./api";
import type ProjectRequest from "../dto/request/projectRequest";
import type {ProjectResponseType}   from "../features/projetos/components/project.types";

export const ProjectService = {
  createProject: async (
    token: string,
    project: ProjectRequest
  ): Promise<ProjectResponseType> => {
    const response = await api.post<ProjectResponseType>("/projects", project, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getAllProjects: async (token: string): Promise<ProjectResponseType[]> => {
    const response = await api.get<ProjectResponseType[]>("/projects", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getProjectBySlug: async (
    token: string,
    project: ProjectRequest
  ): Promise<ProjectResponseType> => {
    const response = await api.get<ProjectResponseType>(
      `/projects/${project.slug}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  updateProject: async (
    token: string,
    project: ProjectRequest,
    id?: string
  ): Promise<ProjectResponseType> => {
    const response = await api.put<ProjectResponseType>(
      `/projects/${id}`,
      project,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  deleteProject: async (token: string, id?: string): Promise<any> => {
    const response = await api.delete<any>(`/projects/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
