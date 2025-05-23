import React from "react";
import { DatePicker as AntdDatePicker } from "antd";
import { DatePickerType } from "antd/es/date-picker";
import dayjs from "dayjs";
import styled from "styled-components";

import { CommonFormItemProps, FormItem } from "./FormItem";

import { DATE_FORMAT, SERVER_DATE_FORMAT } from "@/constant/date";

export type DatePickerProps = Omit<React.ComponentProps<typeof AntdDatePicker>, "value" | "defaultValue"> &
    CommonFormItemProps & {
        valueFormat?: string;
        defaultValue?: dayjs.Dayjs;
    };

const CustomDatePicker: DatePickerType = styled(AntdDatePicker)`
    &.ant-picker-disabled {
        border: none;
    }
`;

export const DatePicker: React.FC<DatePickerProps> = ({
    name,
    label,
    onChange: customChange,
    onBlur: customBlur,
    format = DATE_FORMAT,
    style,
    isRequired = false,
    direction,
    labelMinWidth,
    labelPosition,
    index,
    valueFormat,
    disabled = false,
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
        styleLabel={styleLabel}
        index={index}
        render={({ onChange, onBlur, value, ...field }) => {
            return (
                <CustomDatePicker
                    onChange={(v, dateString) => {
                        onChange(v?.format(valueFormat ?? SERVER_DATE_FORMAT) ?? "");
                        customChange?.(value, dateString);
                        onBlur();
                    }}
                    onBlur={(...params) => {
                        onBlur();
                        customBlur?.(...params);
                    }}
                    style={{
                        width: "100%",
                        height: 40,
                        padding: "12px 16px",
                        borderRadius: 8,
                        ...style
                    }}
                    disabled={disabled}
                    value={value ? dayjs(value) : undefined}
                    format={format}
                    {...field}
                    {...rest}
                />
            );
        }}
    />
);
