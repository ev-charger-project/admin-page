import evChargerService from "@/config/axios/evChargerService";
import { ListType } from "@/interfaces/list-type";
import {
    GetListPowerOutputParams,
    PowerOutput,
    PowerOutputPayload,
    UpdatePowerOutputPayload
} from "@/interfaces/power-output";

export const getPowerOutputsApi = (params: GetListPowerOutputParams) =>
    evChargerService.get<ListType<PowerOutput>>("/power-outputs", {
        params
    });

export const getPowerOutputApi = (id: string) => evChargerService.get<PowerOutput>(`/power-outputs/${id}`);

export const createPowerOutputApi = (payload: PowerOutputPayload) =>
    evChargerService.post<PowerOutput>("/power-outputs", payload);

export const updatePowerOutputApi = (payload: UpdatePowerOutputPayload) => {
    const { id, ...rest } = payload;
    return evChargerService.patch<PowerOutput>(`/power-outputs/${id}`, rest);
};

export const deletePowerOutputApi = (id: string) => evChargerService.delete<PowerOutput>(`/power-outputs/${id}`);
