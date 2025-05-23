import evChargerService from "@/config/axios/evChargerService";
import {
    CreateLocationSearchHistoryPayload,
    UpdateLocationSearchHistoryPayload,
    GetListLocationSearchHistoryParams,
    LocationSearchHistoryModel
} from "@/interfaces/location-search-history";
import { ListType } from "@/interfaces/list-type";

export const getLocationSearchHistoriesApi = (params: GetListLocationSearchHistoryParams) =>
    evChargerService.get<ListType<LocationSearchHistoryModel>>("/location-search-history", {
        params
    });

export const getLocationSearchHistoryApi = (id: string) =>
    evChargerService.get<LocationSearchHistoryModel>(`/location-search-history/${id}`);

export const createLocationSearchHistoryApi = (data: CreateLocationSearchHistoryPayload) =>
    evChargerService.post<LocationSearchHistoryModel>("/location-search-history", data);

export const updateLocationSearchHistoryApi = (data: UpdateLocationSearchHistoryPayload) => {
    const { id, ...rest } = data;
    return evChargerService.patch<LocationSearchHistoryModel>(`/location-search-history/${id}`, rest);
};

export const deleteLocationSearchHistoryApi = (id: string) =>
    evChargerService.delete<LocationSearchHistoryModel>(`/location-search-history/${id}`);
