import { ReactNode, useMemo, useRef, useState } from "react";
import { Select as SelectAntd, SelectProps as SelectAntdProps } from "antd";
import React from "react";

import ButtonFormControl from "./ButtonFormControl";
import { CommonFormItemProps, FormItem } from "./FormItem";
import OptionLoading from "./OptionLoading";

import styles from "./select.module.css";

import { ISelectOptions, SelectValueType } from "@/constant/select";
import { ButtonWrapper, ExtraSelectProps } from "@/interfaces/form";
import DropdownHeader from "@/components/DropdownHeader";
import DropdownRow from "@/components/DropdownRow";
import { useOnClickOutside } from "@/hook/useOnClickOutside";

export type SelectProps<T extends SelectValueType = SelectValueType, V = any> = Omit<
    SelectAntdProps<T, ISelectOptions<T, V>>,
    "direction" | "onChange"
> &
    CommonFormItemProps & {
        options: ISelectOptions<T, V>[];
        renderOption?: (option: ISelectOptions<T, V>) => React.ReactNode;
        renderSelectedLabel?: (option: ISelectOptions<T, V>) => React.ReactNode;
        prefixIcon?: React.ReactNode;
        readOnly?: boolean;
        onChange?: (value: T, option: ISelectOptions<T, V> | ISelectOptions<T, V>[], ...event: any[]) => void;
    } & ExtraSelectProps<T, V> &
    ButtonWrapper;

export function Select<T extends SelectValueType = SelectValueType, V = any>({
    name,
    label,
    onChange: customChange,
    onBlur: customBlur,
    filterOption,
    options,
    renderOption,
    renderSelectedLabel,
    prefixIcon,
    isRequired = false,
    direction,
    labelMinWidth,
    labelPosition,
    readOnly = false,
    disabled,
    dropdownStyle,
    dropdownColumns,
    dropdownLoading,
    onDeselect,
    isButton,
    buttonLabel,
    maxSelection,
    index,
    styleLabel = {},
    ...rest
}: SelectProps<T, V>) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const _renderOption = (option: ISelectOptions<T, V>): string | ReactNode => {
        if (dropdownColumns) {
            return (
                <DropdownRow
                    config={dropdownColumns(option).map((i) => ({
                        render: () => <div>{i.content}</div>,
                        span: i.span
                    }))}
                />
            );
        }
        if (renderOption) {
            return renderOption(option);
        }
        return option.label;
    };

    const finalDropdownStyle = useMemo(() => {
        if (readOnly) {
            return { ...dropdownStyle, display: "none" };
        }
        return dropdownStyle;
    }, [dropdownStyle, readOnly]);

    const defaultSearchFilter = (input: string, option: ISelectOptions<T, V> | undefined) => {
        if (!option) {
            return false;
        }
        const value = option.value;

        if (typeof value !== "string") {
            console.error("please implement custom filterOption for using search function");
            return true;
        }

        return value.includes(input);
    };
    const buttonWrapperRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef(null);
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
        if (buttonWrapperRef.current?.contains(e.target as HTMLElement)) {
            return;
        }
        setIsOpen(false);
    };
    useOnClickOutside(dropdownRef, handleClickOutside);
    return (
        <FormItem
            name={name}
            label={label}
            isRequired={isRequired}
            direction={direction}
            labelMinWidth={labelMinWidth}
            labelPosition={labelPosition}
            styleLabel={styleLabel}
            index={index}
            render={({ onChange, onBlur, ...field }) => {
                return (
                    <div ref={buttonWrapperRef}>
                        <ButtonFormControl
                            value={field.value}
                            isButton={isButton}
                            buttonLabel={buttonLabel}
                            onClick={() => {
                                setIsOpen((prev) => !prev);
                            }}>
                            <div className={styles["select-wrapper"]}>
                                {prefixIcon && <div className={styles["prefix-icon"]}>{prefixIcon}</div>}
                                <SelectAntd<T, ISelectOptions<T, V>>
                                    className={`${prefixIcon ? styles["custom-select"] : ""} ${
                                        disabled ? styles["disabled-select"] : ""
                                    }`}
                                    open={isButton ? isOpen : undefined}
                                    onChange={(value, option) => {
                                        if (readOnly) {
                                            return;
                                        }
                                        if (
                                            rest.mode === "multiple" &&
                                            maxSelection &&
                                            Array.isArray(value) &&
                                            value.length > maxSelection
                                        ) {
                                            return;
                                        }
                                        onChange(value);
                                        customChange?.(value, option, index);
                                    }}
                                    onBlur={(...props) => {
                                        if (readOnly) {
                                            return;
                                        }

                                        onBlur();
                                        customBlur?.(...props);
                                    }}
                                    onDeselect={(value, option) => {
                                        onBlur();
                                        if (onDeselect) {
                                            onDeselect(value, option);
                                        }
                                    }}
                                    optionLabelProp="label"
                                    filterOption={filterOption ?? defaultSearchFilter}
                                    disabled={disabled}
                                    listItemHeight={40}
                                    dropdownStyle={finalDropdownStyle}
                                    dropdownRender={(menu) => {
                                        if (!dropdownColumns) {
                                            return <div ref={dropdownRef}>{menu}</div>;
                                        }
                                        return (
                                            <div ref={dropdownRef}>
                                                {dropdownLoading ? (
                                                    <OptionLoading />
                                                ) : (
                                                    <DropdownHeader
                                                        config={dropdownColumns().map((i) => ({
                                                            label: i.label,
                                                            span: i.span
                                                        }))}>
                                                        {menu}
                                                    </DropdownHeader>
                                                )}
                                            </div>
                                        );
                                    }}
                                    popupMatchSelectWidth={false}
                                    {...field}
                                    {...rest}>
                                    {options?.map((option) => (
                                        <SelectAntd.Option
                                            value={option.value}
                                            label={renderSelectedLabel ? renderSelectedLabel(option) : option.label}
                                            key={option.value}
                                            extraData={option.extraData}>
                                            {_renderOption(option)}
                                        </SelectAntd.Option>
                                    ))}
                                </SelectAntd>
                            </div>
                        </ButtonFormControl>
                    </div>
                );
            }}
        />
    );
}
