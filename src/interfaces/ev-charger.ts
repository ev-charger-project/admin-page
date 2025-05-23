import { FilterBase, MetaData, Undefinedable } from "./base";
import { PowerPlugType } from "./power-plug-type";

export interface EVChargerPort extends MetaData {
    power_plug_type_id: string;
    power_output_id: string;
    power_output: EVCharger;
    power_plug_type: PowerPlugType;
}

export interface EVCharger extends MetaData {
    id: string;
    location_id: string;
    station_name: string;
    availability: string;
    ev_charger_ports: EVChargerPort[];
    location: { location_name: string };
    installation_date: string | null;
    last_maintenance_date: string | null;
}

export interface EVChargerPortPayload
    extends Undefinedable<Pick<EVChargerPort, "power_plug_type_id" | "power_output_id">> {
    id: string | undefined;
}

export interface CreateEVChargerPayload
    extends Pick<
        EVCharger,
        "station_name" | "installation_date" | "location_id" | "last_maintenance_date" | "availability"
    > {
    ev_charger_ports: EVChargerPortPayload[] | null;
}

export interface UpdateEVChargerPayload extends CreateEVChargerPayload {
    id: string;
}

export type GetListEVChargerParams = FilterBase<EVCharger>;
export type EVChargerModel = EVCharger;
