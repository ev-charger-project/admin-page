import { ListType } from "@/interfaces/list-type";
import { GetListEvUserParams, EvUser, EvUserPayload, UpdateEvUserPayload } from "@/interfaces/ev-user";
import authService from "@/config/axios/authService";

export const getEvUsersApi = (params: GetListEvUserParams) =>
    authService.get<ListType<EvUser>>("/user", {
        params
    });

export const getEvUserApi = (id: string) => authService.get<EvUser>(`/user/${id}`);

export const createEvUserApi = (payload: EvUserPayload) => authService.post<EvUser>("/user", payload);

export const updateEvUserApi = (payload: UpdateEvUserPayload) => {
    const { id, ...rest } = payload;
    return authService.patch<EvUser>(`/user/${id}`, rest);
};

export const deleteEvUserApi = (id: string) => authService.delete<EvUser>(`/user/${id}`);
