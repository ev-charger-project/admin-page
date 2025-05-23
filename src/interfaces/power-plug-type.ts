import { FilterBase, MetaData } from "@/interfaces/base";

export interface PowerPlugType extends MetaData {
    power_plug_region: string;
    plug_image_url: string | null;
    power_model: string;
    id: string;
    additional_note: string | null;
    plug_type: string;
}

export interface PowerPlugTypePayload
    extends Pick<
        PowerPlugType,
        "power_model" | "power_plug_region" | "plug_type" | "plug_image_url" | "additional_note"
    > {}

export interface UpdatePowerPlugTypePayload
    extends Pick<
        PowerPlugType,
        "id" | "power_model" | "power_plug_region" | "plug_type" | "plug_image_url" | "additional_note"
    > {}

export type GetListPowerPlugTypeParams = FilterBase<PowerPlugType>;
export type PowerPlugTypeModel = PowerPlugType;
