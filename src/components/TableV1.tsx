"use client";
import React, { useMemo } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Flex, Table as AntdTable, TableProps, Typography } from "antd";
import styled from "styled-components";

import SharedButton from "./button/SharedButton";

import { themeConstants } from "@/constant/theme";
import { CustomColumnsType } from "@/interfaces/table";
import { c } from "@/utils/string";
import { generateColumns } from "@/utils/table";

const StyledTable = styled(AntdTable)<{
    scroll?: object;
}>`
    .ant-table {
        background-color: rgba(0, 0, 0, 0);

        .ant-table-container {
            .ant-table-content {
                padding-bottom: ${(props) => (props.scroll ? 24 : 0)}px;

                table {
                    table-layout: fixed;
                    height: 100%;
                    border: 1px solid var(--border-color, #bf0a0a);
                    border-radius: 8px;

                    .ant-table-thead > tr > th {
                        text-align: center;
                        font-size: 12px;
                        font-weight: 600;
                        line-height: 16px;
                        height: 72px;
                        padding: 0px 24px;
                    }

                    .ant-table-tbody > tr > td {
                        text-align: center;
                        font-size: 12px;
                        font-weight: 400;
                        line-height: 20px;
                        height: 64px;
                        color: var(--content-color, #bf0a0a);
                    }

                    .ant-table-summary > tr > td {
                        text-align: center;
                        font-size: 16px;
                        font-style: normal;
                        font-weight: 700;
                        line-height: 16px;
                        color: var(--header-color, #bf0a0a);
                    }
                }
            }
        }
    }

    .ant-table-pagination.ant-pagination {
        margin-bottom: 0 !important;
    }
`;

const Containter = styled(Flex)<ExtraStyle>`
    padding: ${(props) => (props.showBorder ? "32px" : "0")};
    border-radius: 16px;
    border: ${(props) => (props.showBorder ? `1px solid ${themeConstants.borderDefault}` : "none")};
    background: themeConstants.contentBgColor;
`;

type ExtraStyle = {
    showBorder?: boolean;
};

type Props<T extends Record<string, any>, U extends Record<string, any>> = Omit<TableProps, "columns"> & {
    addButtonLabel?: string;
    onClickAdd?: () => void;
    tableTitle?: string;
    columns?: CustomColumnsType<T, U>;
    icon?: React.ReactNode;
} & ExtraStyle;

const TableV1 = <T extends Record<string, any>, U extends Record<string, any>>({
    columns,
    addButtonLabel,
    onClickAdd,
    tableTitle,
    showBorder = true,
    icon = <PlusOutlined />,
    style = {},
    ...rest
}: Props<T, U>) => {
    const _columns = useMemo(() => (columns ? generateColumns(columns) : undefined), [columns]);
    const tableStyle = {
        "--header-color": themeConstants.tableHeader,
        "--content-color": themeConstants.tableContent,
        "--border-color": themeConstants.tableBorder
    };

    return (
        <Containter vertical className="container-table" showBorder={showBorder}>
            {!!tableTitle && (
                <Typography
                    style={{
                        marginTop: 0,
                        marginBottom: 24,
                        fontSize: 16,
                        fontWeight: 700,
                        fontStyle: "normal",
                        color: themeConstants.titleDefault,
                        lineHeight: "22px"
                    }}>
                    {c(tableTitle)}
                </Typography>
            )}
            <StyledTable {...rest} columns={_columns} style={{ ...style, ...tableStyle }} />
            {addButtonLabel && (
                <Flex justify="start">
                    <SharedButton
                        title={addButtonLabel}
                        icon={icon}
                        onClick={onClickAdd}
                        customType="action"
                        customSize="sm"
                        style={{ marginTop: 40 }}
                    />
                </Flex>
            )}
        </Containter>
    );
};

export default TableV1;
