"use client";
import { CSSProperties, ReactNode, useMemo } from "react";
import { Controller, ControllerRenderProps, FieldPath, FieldValues, useFormContext } from "react-hook-form";
import { Flex, Form, FormItemProps as AntdFormItemProps } from "antd";

import { getObjectValueWithPath, includeIndexToName } from "@/utils/form";
import { replaceLastOccurrence } from "@/utils/string";
import React from "react";

export type FormItemProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<AntdFormItemProps, "name"> &
    CommonFormItemProps & {
        render: (props: Omit<ControllerRenderProps<TFieldValues, TName>, "ref">) => ReactNode;
    };

export interface CommonFormItemProps {
    name: string;
    label?: ReactNode;
    isRequired?: boolean;
    direction?: "vertical" | "horizontal";
    labelMinWidth?: string;
    labelPosition?: "before" | "after";
    index?: number[];
    styleLabel?: CSSProperties;
    showLabel?: boolean;
}

export const FormItem = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    name,
    label,
    isRequired = false,
    direction = "vertical",
    labelMinWidth,
    labelPosition = "before",
    index,
    styleLabel = {},
    className,
    showLabel,
    ...rest
}: FormItemProps<TFieldValues, TName>) => {
    const render = rest.render;
    const { control, formState } = useFormContext();
    const shouldShowLabel = useMemo(() => {
        if (typeof showLabel === "boolean") {
            return showLabel;
        }
        return !!label;
    }, [label, showLabel]);
    const finalName = useMemo(() => {
        return (Array.isArray(index) && index.length > 0 ? includeIndexToName(name, index) : name) as TName;
    }, [index, name]);

    const errorMessage = useMemo<FormItemProps["help"]>(() => {
        let message = getObjectValueWithPath(formState.errors, replaceLastOccurrence(finalName, ".[]", ".root"));

        if (!message) {
            message = getObjectValueWithPath(formState.errors, replaceLastOccurrence(finalName, ".[]", ""));
        }
        if (finalName && message) {
            return String(message?.message);
        }
    }, [formState, finalName]);

    const status = useMemo<FormItemProps["validateStatus"]>(() => {
        if (finalName && errorMessage) {
            return "error";
        }
    }, [errorMessage, finalName]);

    const renderLabel = useMemo<ReactNode>(() => {
        return (
            <>
                {label ?? "empty"}
                {isRequired && <span style={{ color: "red", marginLeft: "3px" }}>*</span>}
            </>
        );
    }, [isRequired, label]);

    const flexDirection = useMemo(() => {
        if (labelPosition === "after") {
            return direction === "vertical" ? "column-reverse" : "row-reverse";
        }

        return direction === "vertical" ? "column" : "row";
    }, [direction, labelPosition]);

    const alignItems = useMemo(() => {
        if (flexDirection === "row" || flexDirection === "row-reverse") {
            return "baseline";
        }
    }, [flexDirection]);
    return (
        <Flex
            className={className}
            gap="8px"
            style={{
                flexDirection,
                alignItems
            }}>
            {shouldShowLabel && (
                <div
                    className="form-item-label"
                    style={{
                        minWidth: labelMinWidth,
                        lineHeight: "18px",
                        fontWeight: 500,
                        color: "#263E56",
                        ...styleLabel,
                        visibility: label ? "visible" : "hidden"
                    }}>
                    {renderLabel}
                </div>
            )}
            <Form.Item
                {...rest}
                style={{
                    marginBottom: "0px",
                    ...rest.style
                }}
                label=""
                validateStatus={status}
                help={errorMessage}>
                <Controller
                    name={finalName}
                    control={control}
                    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                    render={({ field: { ref: _ref, ...field } }) => {
                        return <>{render(field)}</>;
                    }}
                />
            </Form.Item>
        </Flex>
    );
};
