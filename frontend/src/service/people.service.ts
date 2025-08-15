import api from "./api.ts";
import type PeopleRequest from "../dto/request/peopleRequest.ts";
import type PeopleResponse from "../dto/response/peopleResponse.ts";

export const PeopleService = {
  createPeople: async (
    token: string,
    people: PeopleRequest
  ): Promise<PeopleResponse> => {
    const response = await api.post<PeopleResponse>(`/people`, people, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getAllPeople: async (token: string): Promise<PeopleResponse[]> => {
    const response = await api.get<PeopleResponse[]>(`/people`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getPeopleById: async (
    token: string,
    peopleId: string
  ): Promise<PeopleResponse> => {
    const response = await api.get<PeopleResponse>(`/people/${peopleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  updatePeople: async (
    token: string,
    peropleId: string,
    people: PeopleRequest
  ): Promise<PeopleResponse> => {
    const response = await api.put<PeopleResponse>(
      `/people/${peropleId}`,
      people,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  deletePeople: async (token: string, peropleId: string): Promise<any> => {
    const response = await api.delete<any>(`/people/${peropleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
