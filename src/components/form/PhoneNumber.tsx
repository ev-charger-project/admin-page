import React from "react";
import { InputProps } from "antd";

import { CommonFormItemProps, FormItem } from "./FormItem";
import { StyledInput } from "./StyleComponents";
import { formatPhoneNumber, unFormatPhoneNumber } from "@/utils/phoneNumber";

// TODO: will replace the function renderValue to renderReadOnlyValue

export type PhoneNumberProps = CommonFormItemProps &
    InputProps & {
        renderValue?: (value: any) => React.ReactNode;
    };

export const PhoneNumberField: React.FC<PhoneNumberProps> = ({
    name,
    label,
    onChange: customChange,
    onBlur: customBlur,
    onFocus: customFocus,
    isRequired = false,
    direction,
    labelMinWidth,
    labelPosition,
    readOnly = false,
    disabled,
    renderValue,
    index,
    styleLabel = {},
    ...rest
}) => {
    return (
        <FormItem
            label={label}
            name={name}
            isRequired={isRequired}
            direction={direction}
            labelMinWidth={labelMinWidth}
            labelPosition={labelPosition}
            styleLabel={styleLabel}
            index={index}
            render={({ onChange, onBlur, ...field }) => {
                if (readOnly) {
                    return (
                        <div
                            style={{
                                width: "100%",
                                border: disabled ? "none" : "1px solid #CCD1D4",
                                boxSizing: "border-box",
                                backgroundColor: disabled ? "rgba(38, 62, 86, 0.10)" : undefined,
                                minHeight: 40,
                                maxHeight: 40,
                                borderRadius: 8,
                                alignItems: "center",
                                display: "flex",
                                padding: "12px 16px",
                                fontSize: "14px",
                                fontWeight: 400,
                                lineHeight: "18px"
                            }}>
                            <div
                                style={{
                                    visibility: field.value ? "visible" : "hidden"
                                }}>
                                {renderValue ? renderValue(field.value) : field.value || "&N/A"}
                            </div>
                        </div>
                    );
                }

                return (
                    <StyledInput
                        onChange={(e) => {
                            onChange(e);
                            customChange?.(e);
                        }}
                        onBlur={(e) => {
                            const newValue = formatPhoneNumber(e.target.value);
                            onChange(newValue);
                            onBlur();
                            customBlur?.(e);
                        }}
                        onFocus={(e) => {
                            const newValue = unFormatPhoneNumber(e.target.value);
                            onChange(newValue);
                            customFocus?.(e);
                        }}
                        readOnly={readOnly}
                        disabled={readOnly ? false : disabled}
                        {...field}
                        {...rest}
                    />
                );
            }}
        />
    );
};
