import evChargerService from "@/config/axios/evChargerService";
import { ListType } from "@/interfaces/list-type";
import {
    GetListEVChargerParams,
    EVCharger,
    CreateEVChargerPayload,
    UpdateEVChargerPayload
} from "@/interfaces/ev-charger";

export const getEVChargersApi = (params: GetListEVChargerParams) =>
    evChargerService.get<ListType<EVCharger>>("/ev-chargers", {
        params
    });

export const getEVChargerApi = (id: string) => evChargerService.get<EVCharger>(`/ev-chargers/${id}`);

export const createEVChargerApi = (payload: CreateEVChargerPayload) =>
    evChargerService.post<EVCharger>("/ev-chargers", payload);

export const updateEVChargerApi = (payload: UpdateEVChargerPayload) => {
    const { id, ...rest } = payload;
    return evChargerService.patch<EVCharger>(`/ev-chargers/${id}`, rest);
};

export const deleteEVChargerApi = (id: string) => evChargerService.delete<EVCharger>(`/ev-chargers/${id}`);
