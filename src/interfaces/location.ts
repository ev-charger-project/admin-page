import { FilterBase, MetaData } from "@/interfaces/base";
import { WorkingDayPayload, WorkingDayModel } from "./working_day";
import { AmenityModel } from "./amenity";

export interface LocationAmenity extends MetaData {
    id: string;
    amenities: AmenityModel;
}

export interface Location extends MetaData {
    id: string;
    location_name: string;
    street: string;
    district: string | null;
    city: string;
    country: string;
    postal_code: string | null;
    latitude: number;
    longitude: number;
    description: string | null;
    image_url: string | null;
    working_days: WorkingDayModel[];
    location_amenities: LocationAmenity[] | null;
    pricing: string | null;
    phone_number: string | null;
    parking_level: string | null;
}

export interface City {
    name: string;
}

export interface District {
    name: string;
}

export interface CreateLocationPayload
    extends Pick<
        Location,
        | "location_name"
        | "street"
        | "district"
        | "city"
        | "country"
        | "postal_code"
        | "latitude"
        | "longitude"
        | "description"
        | "image_url"
        | "pricing"
        | "phone_number"
        | "parking_level"
    > {
    amenities_id: string[] | null;
    working_days: WorkingDayPayload[];
}

export interface UpdateLocationPayload extends CreateLocationPayload {
    id: string;
}

export type GetListCityParams = FilterBase<City> & {
    name?: string;
    country: string;
};

export type GetListDistrictParams = FilterBase<District> & {
    name?: string;
    city: string;
};

export type GetListLocationParams = FilterBase<Location>;

export type LocationModel = Location;
export type CityModel = City;
export type DistrictModel = District;
