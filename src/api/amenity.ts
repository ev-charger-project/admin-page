import evChargerService from "@/config/axios/evChargerService";
import { CreateAmenityPayload, UpdateAmenityPayload, GetListAmenityParams, Amenity } from "@/interfaces/amenity";
import { ListType } from "@/interfaces/list-type";

export const getAmenitiesApi = (params: GetListAmenityParams) =>
    evChargerService.get<ListType<Amenity>>("/amenities", {
        params
    });

export const getAmenityApi = (id: string) => evChargerService.get<Amenity>(`/amenities/${id}`);

export const createAmenityApi = (data: CreateAmenityPayload) => evChargerService.post<Amenity>("/amenities", data);

export const updateAmenityApi = (data: UpdateAmenityPayload) => {
    const { id, ...rest } = data;
    return evChargerService.patch<Amenity>(`/amenities/${id}`, rest);
};

export const deleteAmenityApi = (id: string) => evChargerService.delete<Amenity>(`/amenities/${id}`);
