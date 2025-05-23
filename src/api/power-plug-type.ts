import evChargerService from "@/config/axios/evChargerService";
import {
    GetListPowerPlugTypeParams,
    PowerPlugType,
    PowerPlugTypePayload,
    UpdatePowerPlugTypePayload
} from "@/interfaces/power-plug-type";
import { ListType } from "@/interfaces/list-type";

export const getPowerPlugTypesApi = (params: GetListPowerPlugTypeParams) =>
    evChargerService.get<ListType<PowerPlugType>>("/power-plug-types", {
        params
    });

export const createPowerPlugTypeApi = (data: PowerPlugTypePayload) =>
    evChargerService.post<PowerPlugType>("/power-plug-types", data);

export const updatePowerPlugTypeApi = (data: UpdatePowerPlugTypePayload) => {
    const { id, ...rest } = data;
    return evChargerService.patch<PowerPlugType>(`/power-plug-types/${id}`, rest);
};

export const deletePowerPlugTypeApi = (id: string) => evChargerService.delete<PowerPlugType>(`/power-plug-types/${id}`);

export const getPowerPlugTypeApi = (id: string) => evChargerService.get<PowerPlugType>(`/power-plug-types/${id}`);
