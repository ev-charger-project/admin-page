import { CheckboxOptionType } from "antd/es/checkbox/Group";

import { MultipleCheckboxValueType } from "@/components/form/MultipleCheckbox";
import { TreeSelectProps } from "@/components/form/TreeSelect";
import { ISelectOptions, SelectValueType } from "@/constant/select";
import { EnumStruct, EnumValue } from "@/interfaces/enum";
import { Nullable } from "@/interfaces/base";

export const enumToSelectOptions = <T extends SelectValueType = SelectValueType>(
    enumObj: EnumStruct<T>
): ISelectOptions<T>[] => {
    return Object.keys(enumObj).map((key) => ({
        label: enumObj[key].label,
        value: enumObj[key].value
    }));
};
export const enumToMultiCheckboxOptions = <T extends MultipleCheckboxValueType = MultipleCheckboxValueType>(
    enumObj: EnumStruct<T>
): CheckboxOptionType<T>[] => {
    return Object.keys(enumObj).map((key) => ({
        label: enumObj[key].label,
        value: enumObj[key].value
    }));
};

export const getEnumFromValue = <
    T extends SelectValueType = SelectValueType,
    V extends Record<string, any> = Nullable<unknown>
>(
    enumObj: EnumStruct<T, V>,
    value: T
): EnumValue<T, V> | null => Object.values(enumObj).find((enumItem) => enumItem.value === value) ?? null;

export type TreeData = Exclude<TreeSelectProps["treeData"], undefined>;

type ParamItem<T> =
    | {
          groupTitle?: undefined;
          enums: EnumStruct<T>;
      }
    | {
          groupTitle: string;
          children: ParamItem<T>[];
      };

export const enumsToTreeData = <T extends SelectValueType = SelectValueType>(arr: ParamItem<T>[]): TreeData => {
    const result: TreeData = [];

    for (const item of arr) {
        if (item.groupTitle === undefined) {
            result.push(
                ...Object.keys(item.enums).map((key) => ({
                    title: item.enums[key].label,
                    value: item.enums[key].value ?? undefined
                }))
            );
        } else {
            result.push({
                title: item.groupTitle,
                disabled: true,
                children: enumsToTreeData(item.children),
                value: item.groupTitle
            });
        }
    }

    return result;
};
