import React from "react";
import { InputNumberProps } from "antd";
import { debounce } from "lodash";
import styled from "styled-components";

import { CommonFormItemProps, FormItem } from "./FormItem";
import { StyledInputNumber } from "./StyleComponents";

export type CurrencyFieldProps = CommonFormItemProps & InputNumberProps<number>;

let CurrencyField: React.FC<CurrencyFieldProps> = ({
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
    index,
    styleLabel = {},
    className,
    ...rest
}) => {
    const onChangeInput = (value: null | number, onChange: (...event: any[]) => void) => {
        onChange(value);
        customChange?.(value);
    };

    const debounceOnchange = debounce(onChangeInput, 300);
    return (
        <FormItem<{ a: number }, "a">
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
                return (
                    <StyledInputNumber
                        onChange={(value) => {
                            debounceOnchange(value, onChange);
                        }}
                        onBlur={(...e) => {
                            onBlur();
                            customBlur?.(...e);
                        }}
                        readOnly={readOnly}
                        disabled={readOnly ? false : disabled}
                        formatter={(value) => formatCurrency(value ?? 0)}
                        parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as unknown as number}
                        {...field}
                        {...rest}
                        className="form-textfield"
                    />
                );
            }}
        />
    );
};

CurrencyField = styled(CurrencyField)`
    &.mobile {
        .form-item-label {
            color: #7f8eac;
        }

        .form-textfield {
            color: #06417c;
        }
    }

    .ant-input-number-input-wrap,
    .ant-input-number-input {
        height: 100%;
        color: #263e56;
        padding: 0;
    }

    .ant-input-number-prefix {
        line-height: normal;
    }

    .ant-input-number-disabled {
        color: #263e56;
    }
`;

export { CurrencyField };

export const formatCurrency = (input: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
        minimumFractionDigits: 0
    }).format(Number(input ?? 0));
};
