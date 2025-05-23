import React from "react";
import { TimePicker as AntdTimePicker } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { PickerLocale } from "antd/es/date-picker/generatePicker";
import dayjs, { Dayjs } from "dayjs";

import { CommonFormItemProps, FormItem } from "./FormItem";

import { TIME_FORMAT } from "@/constant/date";

export type TimePickerProps = Omit<React.ComponentProps<typeof AntdTimePicker>, "onChange"> &
    CommonFormItemProps & {
        valueFormat?: string;
        size?: SizeType;
        locale?: PickerLocale;
        defaultValue?: string;
    } & {
        onChange?: (value: Dayjs | null, dateString: string | string[], index?: number[]) => void;
    };

export const TimePicker: React.FC<TimePickerProps> = ({
    name,
    label,
    onChange: customChange,
    onBlur: customBlur,
    style,
    isRequired = false,
    direction,
    labelMinWidth,
    labelPosition,
    index,
    valueFormat,
    styleLabel = {},
    ...rest
}) => (
    <FormItem
        label={label}
        name={name}
        isRequired={isRequired}
        direction={direction}
        labelMinWidth={labelMinWidth}
        labelPosition={labelPosition}
        index={index}
        styleLabel={styleLabel}
        render={({ onChange, onBlur, value, ...field }) => {
            return (
                <AntdTimePicker
                    onChange={(value, dateString) => {
                        onChange(value?.format(valueFormat ?? TIME_FORMAT) ?? "");
                        customChange?.(value, dateString, index);
                        onBlur();
                    }}
                    onBlur={(...params) => {
                        onBlur();
                        customBlur?.(...params);
                    }}
                    style={{
                        width: "100%",
                        ...style
                    }}
                    value={
                        value
                            ? dayjs()
                                  .hour(parseInt(value.split(":")[0]))
                                  .minute(parseInt(value.split(":")[1]))
                            : undefined
                    }
                    format={TIME_FORMAT}
                    {...field}
                    {...rest}
                />
            );
        }}
    />
);
