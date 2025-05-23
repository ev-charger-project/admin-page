import { FilterBase, MetaData } from "@/interfaces/base";

export interface Amenity extends MetaData {
    id: string;
    amenities_types: string;
    image_url: string | null;
}

export interface CreateAmenityPayload extends Pick<Amenity, "amenities_types" | "image_url"> {}

export interface UpdateAmenityPayload extends CreateAmenityPayload {
    id?: string;
}

export type GetListAmenityParams = FilterBase<Amenity> & {
    amenities_types?: string;
};
export type AmenityModel = Amenity;
