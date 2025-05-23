import React from "react";
import { Checkbox, CheckboxProps, Col, ColProps, Flex, Row, RowProps } from "antd";
import { CheckboxOptionType } from "antd/es/checkbox/Group";

import { CommonFormItemProps, FormItem } from "./FormItem";

import { ButtonWrapper } from "@/interfaces/form";

export type MultipleCheckboxValueType = string | number;

export type MultipleCheckboxProps = Omit<CheckboxProps, "onChange" | "options"> &
    CommonFormItemProps & {
        options: CheckboxOptionType<MultipleCheckboxValueType>[];
        color?: string;
        readOnly?: boolean;
        onChange?: (value: MultipleCheckboxValueType[]) => void;
        span?: number;
        colProps?: ColProps;
        rowProps?: RowProps;
    } & ButtonWrapper;

export const MultipleCheckbox: React.FC<MultipleCheckboxProps> = ({
    name,
    onChange: customChange,
    isRequired = false,
    direction,
    labelMinWidth,
    labelPosition,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    color: _,
    style,
    readOnly = false,
    styleLabel = {},
    options,
    colProps = {},
    rowProps = {},
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
        render={({ onChange, value, ...field }) => {
            return (
                <Flex gap={40}>
                    <Checkbox.Group
                        value={value ?? []}
                        onChange={(props: MultipleCheckboxValueType[]) => {
                            if (readOnly) {
                                return;
                            }
                            onChange(props);
                            customChange?.(props);
                        }}
                        style={{
                            ...style,
                            backgroundColor: "inherit",
                            fontWeight: 500,
                            lineHeight: "20px"
                        }}
                        disabled={readOnly}
                        {...field}
                        {...rest}>
                        <Row {...rowProps}>
                            {options.map((option) => (
                                <Col key={option.value} {...colProps}>
                                    <Checkbox
                                        defaultChecked={(value ?? []).includes(option.value)}
                                        checked={(value ?? []).includes(option.value)}
                                        value={option.value}>
                                        {option.label}
                                    </Checkbox>
                                </Col>
                            ))}
                        </Row>
                    </Checkbox.Group>
                </Flex>
            );
        }}
    />
);
