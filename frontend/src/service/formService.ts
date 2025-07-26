import api from "./api";

export interface ProjectRequest {
  _id?: string;
  project_name?: string;
  project_slug?: string;
  project_about_html?: string;
  project_team?: any[];
}

// DTO de resposta ao criar/buscar um projeto
export interface ProjectResponse {
  _id: string;
  project_name: string;
  project_slug: string;
  project_about_html: string;
  project_team: any[];
  createdAt: string;
  updatedAt: string;
}
export const formService = {
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
    project: ProjectRequest
  ): Promise<ProjectResponse> => {
    const response = await api.put<ProjectResponse>(
      `/projects/${project._id}`,
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
