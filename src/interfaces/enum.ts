export type EnumValue<T = string, V extends Record<string, any> = NonNullable<unknown>> = {
    label: string;
    value: T;
} & V;

export interface EnumStruct<T = string, V extends Record<string, any> = NonNullable<unknown>> {
    [key: string]: EnumValue<T, V>;
}
