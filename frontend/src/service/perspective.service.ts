import api from "./api.ts";
import type PerspectiveRequest from "../dto/request/perspectiveRequest.ts";
import type PerspectiveResponse from "../dto/response/perspectiveResponse.ts";

export const PerspectiveService = {
  createPerpective: async (
    token: string,
    projectId: string,
    perspective: PerspectiveRequest
  ): Promise<PerspectiveResponse> => {
    const response = await api.post<PerspectiveResponse>(
      `/projects/${projectId}/perspectives`,
      perspective,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  getAllPerspectives: async (
    token: string,
    projectId: string
  ): Promise<PerspectiveResponse[]> => {
    const response = await api.get<PerspectiveResponse[]>(
      `/projects/${projectId}/perspectives`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  getPerspectiveById: async (
    token: string,
    perspectiveId: string
  ): Promise<PerspectiveResponse> => {
    const response = await api.get<PerspectiveResponse>(
      `/perspectives/${perspectiveId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  updatePerspective: async (
    token: string,
    perspectiveId: string,
    perspective: PerspectiveRequest
  ): Promise<PerspectiveResponse> => {
    const response = await api.put<PerspectiveResponse>(
      `/perspectives/${perspectiveId}`,
      perspective,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  deletePerspective: async (
    token: string,
    perspectiveId: string
  ): Promise<any> => {
    const response = await api.delete<any>(`/perspectives/${perspectiveId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
