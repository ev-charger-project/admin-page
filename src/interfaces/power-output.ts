import { FilterBase, MetaData } from "./base";

export interface PowerOutput extends MetaData {
    id: string;
    output_value: number;
    charging_speed: string;
    voltage: number;
    description: string | null;
}

export interface PowerOutputPayload
    extends Pick<PowerOutput, "output_value" | "charging_speed" | "voltage" | "description"> {}

export interface UpdatePowerOutputPayload extends Pick<PowerOutput, "id" | keyof PowerOutputPayload> {}

export type GetListPowerOutputParams = FilterBase<PowerOutput>;
export type PowerOutputModel = PowerOutput;
