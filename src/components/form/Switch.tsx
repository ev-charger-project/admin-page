import React from "react";
import { Switch as SwitchAntd, SwitchProps as SwitchAntdProps } from "antd";

import ButtonFormControl from "./ButtonFormControl";
import { CommonFormItemProps, FormItem } from "./FormItem";

import { ButtonWrapper } from "@/interfaces/form";

export type SwitchProps = SwitchAntdProps &
    CommonFormItemProps & {
        color?: string;
        readOnly?: boolean;
    } & ButtonWrapper;

export const Switch: React.FC<SwitchProps> = ({
    name,
    label,
    onChange: customChange,
    isRequired = false,
    direction,
    labelMinWidth,
    labelPosition,
    color = "#21A65E",
    style,
    readOnly = false,
    isButton,
    buttonLabel,
    styleLabel = {},
    ...rest
}) => (
    <FormItem
        valuePropName="checked"
        label={label}
        name={name}
        isRequired={isRequired}
        direction={direction}
        labelMinWidth={labelMinWidth}
        labelPosition={labelPosition}
        styleLabel={{ fontWeight: 600, lineHeight: "18px", ...styleLabel }}
        render={({ onChange, value, ...field }) => {
            return (
                <ButtonFormControl
                    buttonLabel={buttonLabel}
                    isButton={isButton}
                    value={value}
                    onClick={() => {
                        onChange(!value);
                    }}>
                    <SwitchAntd
                        defaultChecked={value ?? false}
                        checked={value ?? false}
                        onChange={(...props) => {
                            if (readOnly) {
                                return;
                            }
                            onChange(...props);
                            customChange?.(...props);
                        }}
                        style={{
                            ...style,
                            backgroundColor: value ? color : "rgba(0, 0, 0, 0.25)"
                        }}
                        {...field}
                        {...rest}
                    />
                </ButtonFormControl>
            );
        }}
    />
);
