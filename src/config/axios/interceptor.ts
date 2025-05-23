import { AxiosInstance } from "axios";
import evChargerService from "@/config/axios/evChargerService";
import { GetAccessToken } from "@/interfaces/token";
import authService from "@/config/axios/authService";

export const addInterceptor = (clientInstance: AxiosInstance, getAccessToken: GetAccessToken) => {
    clientInstance.interceptors.request.use(async (config) => {
        if (config.headers.Authorization) {
            return config;
        }
        const accessToken = await getAccessToken();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    });

    clientInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            return Promise.reject(error);
        }
    );
};

export const initHttpClient = (getAccessToken: GetAccessToken) => {
    addInterceptor(evChargerService, getAccessToken);
    addInterceptor(authService, getAccessToken);
};
