import { FilterBase, MetaData } from "@/interfaces/base";
import { LocationModel } from "./location";

export interface LocationSearchHistory extends MetaData {
    id: string;
    user_id: string;
    location_id: string;
    location: LocationModel;
}

export interface CreateLocationSearchHistoryPayload extends Pick<LocationSearchHistory, "user_id" | "location_id"> {}

export interface UpdateLocationSearchHistoryPayload extends CreateLocationSearchHistoryPayload {
    id?: string;
}

export type GetListLocationSearchHistoryParams = FilterBase<LocationSearchHistory> & {
    location_id?: string;
    user_id?: string;
};
export type LocationSearchHistoryModel = LocationSearchHistory;
