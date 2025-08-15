import api from "./api";
import type ProjectRequest from "../dto/request/projectRequest";
import type ProjectResponse from "../dto/response/projectResponse";

export const ProjectService = {
  createProject: async (
    token: string,
    project: ProjectRequest
  ): Promise<ProjectResponse> => {
    const response = await api.post<ProjectResponse>("/projects", project, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getAllProjects: async (token: string): Promise<ProjectResponse[]> => {
    const response = await api.get<ProjectResponse[]>("/projects", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getProjectBySlug: async (
    token: string,
    project: ProjectRequest
  ): Promise<ProjectResponse> => {
    const response = await api.get<ProjectResponse>(
      `/projects/${project.project_slug}`,
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
  ): Promise<ProjectResponse> => {
    const response = await api.put<ProjectResponse>(
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
