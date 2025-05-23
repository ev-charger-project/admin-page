import React, { ReactNode, useState } from "react";
import Image from "next/image";
import { TreeSelect as TreeSelectAnd, TreeSelectProps as TreeSelectAntdProps, Typography } from "antd";

import { CommonFormItemProps, FormItem } from "./FormItem";

import styles from "./treeSelect.module.css";

import { TreeData } from "@/utils/enum";

export type TreeSelectProps = CommonFormItemProps &
    Omit<TreeSelectAntdProps, "onChange"> & {
        onChange?: (
            ...args: [...Parameters<Exclude<TreeSelectAntdProps["onChange"], undefined>>, index?: number[]]
        ) => void;
        stylePlaceholder?: React.CSSProperties;
    };

export const TreeSelect: React.FC<TreeSelectProps> = ({
    name,
    label,
    onChange: customChange,
    onBlur: customBlur,
    isRequired = false,
    direction,
    labelMinWidth,
    labelPosition,
    index,
    styleLabel = {},
    className,
    treeData = [],
    placeholder,
    stylePlaceholder = {},
    ...rest
}: TreeSelectProps) => {
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
    const onTreeExpand = (keys: React.Key[]) => {
        setExpandedKeys(keys);
    };
    const titleRender = (nodeData: any) => {
        if (!nodeData.title) {
            if (!nodeData.value) {
                return (
                    <Typography
                        style={{
                            color: "#667085",
                            fontSize: 14,
                            ...stylePlaceholder
                        }}>
                        {placeholder}
                    </Typography>
                );
            }
            const title = findTitleByValue(treeData, nodeData.value);
            return <div>{title}</div>;
        }
        const isExpanded = expandedKeys.includes(nodeData.title);
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0px 32px 0px 16px",
                    height: 36
                }}>
                <span style={{ lineHeight: "20px", fontWeight: 500 }}>{nodeData.title}</span>
                <span className={`icon ${isExpanded ? "expanded" : ""}`}>
                    {nodeData.children ? (
                        <Image src="/icons/dropdown-arrow.svg" alt="icon" width={16} height={16} />
                    ) : null}
                </span>
            </div>
        );
    };
    return (
        <FormItem
            className={className}
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
                    <TreeSelectAnd
                        popupClassName={styles["tree-select-dropdown"]}
                        treeTitleRender={titleRender}
                        onChange={(...e) => {
                            customChange?.(...e, index);
                            onChange(e[0]);
                        }}
                        onBlur={(...e) => {
                            customBlur?.(...e);
                            onBlur();
                        }}
                        treeData={treeData}
                        onTreeExpand={onTreeExpand}
                        {...field}
                        {...rest}
                    />
                );
            }}
        />
    );
};

const findTitleByValue = (data: TreeData, targetValue: string): ReactNode => {
    for (let i = 0; i < data.length; i++) {
        const node = data[i];
        if (node.value === targetValue) {
            return node.title;
        }
        if (node.children) {
            const foundTitle = findTitleByValue(node.children, targetValue);
            if (foundTitle) {
                return foundTitle;
            }
        }
    }
    return undefined;
};
