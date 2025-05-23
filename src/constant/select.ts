import { BaseOptionType } from "antd/es/select";

export type SelectValueType = string | number | null;

export interface ISelectOptions<T extends SelectValueType = SelectValueType, V = any> extends BaseOptionType {
    label: string;
    value: T;
    disabled?: boolean;
    extraData?: V;
}
