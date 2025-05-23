import React from "react";
import { InputProps, Tooltip } from "antd";
import { isNil } from "lodash";
import styled from "styled-components";

import { CommonFormItemProps, FormItem } from "./FormItem";
import { StyledInput } from "./StyleComponents";

import isTextTruncated from "@/utils/textTruncated";

// TODO: will replace the function renderValue to renderReadOnlyValue

export type TextFieldProps = CommonFormItemProps &
    Omit<InputProps, "onChange"> & {
        renderValue?: (value: any) => React.ReactNode;
        onChange?: (e: React.ChangeEvent<HTMLInputElement>, ...event: any[]) => void;
    };

let TextField: React.FC<TextFieldProps> = ({
    name,
    label,
    onChange: customChange,
    onBlur: customBlur,
    isRequired = false,
    direction,
    labelMinWidth,
    labelPosition,
    readOnly = false,
    disabled,
    renderValue,
    index,
    styleLabel = {},
    className,
    addonBefore,
    ...rest
}) => {
    return (
        <FormItem
            className={className}
            label={label}
            name={name}
            isRequired={isRequired}
            direction={direction}
            labelMinWidth={labelMinWidth}
            labelPosition={labelPosition}
            index={index}
            styleLabel={styleLabel}
            render={({ onChange, onBlur, ...field }) => {
                if (readOnly) {
                    const styleDiv: React.CSSProperties = {
                        visibility: !isNil(field.value) ? "visible" : "hidden",
                        width: "100%",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "18px",
                        background: "transparent",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis"
                    };
                    const idTruncate = `truncate${name}`;
                    return (
                        <div
                            style={{
                                width: "auto",
                                border: disabled ? "none" : "1px solid #CCD1D4",
                                borderRadius: "8px",
                                boxSizing: "border-box",
                                backgroundColor: disabled ? "rgba(38, 62, 86, 0.10)" : undefined,
                                alignItems: "center",
                                height: "40px",
                                padding: "10px 16px",
                                display: "flex",
                                ...rest.style
                            }}>
                            <Tooltip title={isTextTruncated(idTruncate) ? field.value : ""}>
                                <div style={styleDiv} id={idTruncate}>
                                    {renderValue ? renderValue(field.value) : field.value}
                                </div>
                            </Tooltip>
                        </div>
                    );
                }

                return (
                    <StyledInput
                        onChange={(e) => {
                            let value: string | number = e.target.value;
                            if (rest.type === "number") {
                                value = +e.target.value; // force convert to Number when type is Number
                            }
                            onChange(value);
                            customChange?.(e, index);
                        }}
                        onBlur={(...e) => {
                            onBlur();
                            customBlur?.(...e);
                        }}
                        readOnly={readOnly}
                        disabled={readOnly ? false : disabled}
                        {...field}
                        {...rest}
                        className="form-textfield"
                        addonBefore={addonBefore}
                    />
                );
            }}
        />
    );
};

TextField = styled(TextField)`
    &.mobile {
        .form-item-label {
            color: #7f8eac;
        }

        .form-textfield {
            color: #06417c;
        }
    }
`;

export { TextField };
