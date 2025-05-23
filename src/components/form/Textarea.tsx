import React from "react";
import { Input } from "antd";
import { TextAreaProps as AntdTextAreaProps } from "antd/es/input";

import { CommonFormItemProps, FormItem } from "./FormItem";

export type TextAreaProps = CommonFormItemProps & AntdTextAreaProps;

export const TextArea: React.FC<TextAreaProps> = ({
    name,
    label,
    onChange: customChange,
    onBlur: customBlur,
    isRequired = false,
    direction = "vertical",
    labelMinWidth,
    labelPosition = "before",
    readOnly = false,
    disabled,
    styleLabel = {},
    ...rest
}) => (
    <FormItem
        label={label}
        isRequired={isRequired}
        name={name}
        direction={direction}
        labelMinWidth={labelMinWidth}
        labelPosition={labelPosition}
        styleLabel={styleLabel}
        render={({ onChange, onBlur, ...field }) => {
            return (
                <Input.TextArea
                    onChange={(e) => {
                        onChange(e);
                        customChange?.(e);
                    }}
                    onBlur={(...e) => {
                        onBlur();
                        customBlur?.(...e);
                    }}
                    readOnly={readOnly}
                    disabled={disabled}
                    {...field}
                    {...rest}
                    style={{
                        backgroundColor: disabled ? "rgba(38, 62, 86, 0.10)" : "#fff",
                        fontSize: "14px",
                        fontWeight: 400,
                        borderRadius: "8px",
                        border: disabled ? "none" : "1px solid #CCD1D4",
                        ...rest.style
                    }}
                />
            );
        }}
    />
);
