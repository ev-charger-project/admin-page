import React from "react";
import { Checkbox, CheckboxProps } from "antd";
import styled from "styled-components";

import ButtonFormControl from "./ButtonFormControl";
import { CommonFormItemProps, FormItem } from "./FormItem";

import { ButtonWrapper } from "@/interfaces/form";

export type SingleCheckboxProps = CheckboxProps &
    CommonFormItemProps & {
        color?: string;
        readOnly?: boolean;
    } & ButtonWrapper;

export const SingleCheckbox: React.FC<SingleCheckboxProps> = ({
    name,
    label,
    onChange: customChange,
    isRequired = false,
    direction,
    labelMinWidth,
    labelPosition,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    color: _,
    style,
    readOnly = false,
    isButton,
    buttonLabel,
    styleLabel = {},
    showLabel,
    ...rest
}) => (
    <FormItem
        valuePropName="checked"
        name={name}
        isRequired={isRequired}
        direction={direction}
        labelMinWidth={labelMinWidth}
        labelPosition={labelPosition}
        styleLabel={styleLabel}
        showLabel={showLabel}
        render={({ onChange, value, ...field }) => {
            return (
                <ButtonFormControl
                    value={value}
                    isButton={isButton}
                    buttonLabel={buttonLabel}
                    onClick={() => {
                        onChange(!value);
                    }}>
                    <StyledCheckbox
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
                            backgroundColor: "inherit",
                            fontWeight: 500,
                            lineHeight: "18px"
                        }}
                        {...field}
                        {...rest}>
                        {label}
                    </StyledCheckbox>
                </ButtonFormControl>
            );
        }}
    />
);

const StyledCheckbox = styled(Checkbox)`
    .ant-checkbox + span {
        padding: 0px 0px 0px 12px;
    }
`;
