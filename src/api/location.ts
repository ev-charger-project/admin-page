import evChargerService from "@/config/axios/evChargerService";
import {
    CreateLocationPayload,
    UpdateLocationPayload,
    GetListLocationParams,
    Location,
    GetListCityParams,
    City,
    District,
    GetListDistrictParams
} from "@/interfaces/location";
import { ListType } from "@/interfaces/list-type";

export const getLocationsApi = (params: GetListLocationParams) =>
    evChargerService.get<ListType<Location>>("/locations", {
        params
    });

export const getLocationApi = (id: string) => evChargerService.get<Location>(`/locations/${id}`);

export const createLocationApi = (data: CreateLocationPayload) => evChargerService.post<Location>("/locations", data);

export const updateLocationApi = (data: UpdateLocationPayload) => {
    const { id, ...rest } = data;
    return evChargerService.patch<Location>(`/locations/${id}`, rest);
};

export const getCitiesApi = (params: GetListCityParams) =>
    evChargerService.get<ListType<City>>(`/cities`, {
        params
    });

export const getDistrictsApi = (params: GetListDistrictParams) =>
    evChargerService.get<ListType<District>>(`/districts`, {
        params
    });

export const deleteLocationApi = (id: string) => evChargerService.delete<Location>(`/locations/${id}`);
