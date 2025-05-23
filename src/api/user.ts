import { UserModel } from "@/interfaces/models/user";
import authService from "@/config/axios/authService";
import { GetUsersParams } from "@/interfaces/user";

export const getMeApi = () => {
    return authService.get<UserModel>("/auth/me");
};

export const getUserListApi = (params: GetUsersParams) => {
    return authService.get<UserModel[]>("/users", {
        params
    });
};

export const getUserByIdApi = (id: string) => {
    return authService.get<UserModel>(`/users/${id}`);
};
