import { AnyObject } from "antd/es/_util/type";
import { ColumnsType, TablePaginationConfig, TableProps } from "antd/es/table";
import { FilterValue, SorterResult } from "antd/es/table/interface";

import { PathInto } from "./form";
import { Nullable } from "@/interfaces/base";

export type DataSourceItem<T> = T & {
    key: string | number;
};

export type CustomColumnsType<
    T extends Record<string, any>,
    ExtraColumns extends Record<string, any> = Nullable<unknown>
> = (Omit<ColumnsType<DataSourceItem<T>>[0], "dataIndex" | "key"> & {
    dataIndex:
        | PathInto<T & { action?: undefined } & ExtraColumns>
        | PathInto<T & { action?: undefined } & ExtraColumns>[];
    key: PathInto<T & { action?: undefined } & ExtraColumns>;
    currencyFormat?: boolean;
})[];

export interface TableParams<T> {
    pagination: TablePaginationConfig;
    sorter?: SorterResult<DataSourceItem<T>>;
    filters?: Record<string, FilterValue | null>;
}

export interface TableChangeParams<T> extends Omit<TableParams<T>, "sorter"> {
    sorter?: SorterResult<DataSourceItem<T>> | SorterResult<DataSourceItem<T>>[];
}

export type TableDataSource<RecordType extends AnyObject = AnyObject> = ({
    isHidden?: boolean;
} & RecordType)[];

export type RefTable = <RecordType extends AnyObject = AnyObject>(
    props: React.PropsWithChildren<
        Omit<TableProps<RecordType>, "dataSource"> & {
            dataSource: TableDataSource<RecordType>[];
        }
    > & {
        ref?: React.Ref<HTMLDivElement>;
    }
) => React.ReactElement;
