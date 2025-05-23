import { useMemo } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Flex, Table, TableProps } from "antd";
import styled from "styled-components";
import React from "react";

import SharedButton from "./button/SharedButton";

import { CustomColumnsType } from "@/interfaces/table";
import { generateColumns } from "@/utils/table";

type Props<T extends Record<string, any>, U extends Record<string, any>> = Omit<TableProps, "columns"> & {
    addButtonLabel?: string;
    onClickAdd?: () => void;
    columns?: CustomColumnsType<T, U>;
};

let TableV2 = <T extends Record<string, any>, U extends Record<string, any>>({
    addButtonLabel,
    onClickAdd,
    columns,
    ...props
}: Props<T, U>) => {
    const _columns = useMemo(() => (columns ? generateColumns(columns) : undefined), [columns]);
    return (
        <>
            <Table {...props} columns={_columns} />
            {addButtonLabel && (
                <Flex justify="start">
                    <SharedButton
                        icon={<PlusOutlined />}
                        title={addButtonLabel}
                        onClick={onClickAdd}
                        customType="action"
                    />
                </Flex>
            )}
        </>
    );
};

TableV2 = styled(TableV2)`
    .ant-table {
        color: #667085;
    }

    .ant-table .ant-table-cell-row-hover {
        background-color: #d0ccd4;
    }

    .ant-table table {
        border-collapse: separate;
        border-spacing: 0px 15px;
    }

    .ant-table table .ant-checkbox {
        border-spacing: 0;
    }

    .ant-table-thead .ant-table-cell {
        background: white;
        color: #667085;
    }

    .ant-table-thead .ant-table-cell::before {
        content: none !important;
    }

    .ant-table-tbody > tr > td {
        padding: 11px 16px !important;
        border-top: 1px solid #f0f0f0;
        border-bottom: 1px solid #f0f0f0;
    }

    .ant-table-tbody > tr.cell-hidden > td,
    .ant-table-tbody > tr.cell-hidden > td.ant-table-cell-row-hover {
        background: #263e56 !important;
    }

    .ant-table-tbody > tr.cell-hidden > td:before {
        content: "";
        z-index: 1;
        opacity: 0.5;
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #263e56 !important;
    }

    .ant-table-tbody > tr.cell-hidden > td:first-child:before,
    .ant-table-tbody > tr.cell-hidden > td:last-child:before {
        display: none;
    }

    .ant-table-tbody > tr > td:first-child,
    .ant-table-tbody > tr > td:last-child {
        border: none;
        background: #fff !important;
    }

    .ant-table-tbody > tr > td.ant-table-cell-row-hover:first-child,
    .ant-table-tbody > tr > td.ant-table-cell-row-hover:last-child {
        background: white !important;
    }

    .ant-table-tbody > tr > td:nth-child(2) {
        border-left: 1px solid #f0f0f0;
        border-radius: 8px 0px 0px 8px;
        overflow: hidden;
    }

    .ant-table-tbody > tr > td:nth-last-child(2) {
        border-right: 1px solid #f0f0f0;
        border-radius: 0px 8px 8px 0px;
        overflow: hidden;
    }

    .ant-table-tbody > tr.cell-hidden > td:not(:first-child) {
        color: #a7b2bc;
    }

    .ant-table-tbody > tr::after {
        content: "";
        display: block;
        height: 16px;
    }

    .ant-table-tbody::before {
        content: "";
        display: block;
    }

    .ant-table-tbody::after {
        content: "";
        display: block;
    }
`;

export default TableV2;
