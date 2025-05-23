import { Flex } from "antd";
import React, { useCallback, useMemo, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { c } from "@/utils/string";
import { CustomColumnsType, DataSourceItem, TableChangeParams, TableParams } from "@/interfaces/table";
import TableV1 from "@/components/TableV1";
import { useGetLocationSearchHistoryList, useDeleteLocationSearchHistory } from "@/hook/location-search-history-hook";
import { GetListLocationSearchHistoryParams, LocationSearchHistoryModel } from "@/interfaces/location-search-history";
import { useFormModal } from "@/HOC/FormModalWrapper";
import { useActionModal } from "@/HOC/ConfirmModalWrapper";
import axios from "axios";

export default function LocationHistoryList(locationId?: string) {
    const handleTableChange = ({ pagination, filters, sorter }: TableChangeParams<LocationSearchHistoryModel>) => {
        if (Array.isArray(sorter)) return;
        setTableParams({
            pagination,
            filters,
            sorter
        });
    };

    const [tableParams, setTableParams] = useState<TableParams<LocationSearchHistoryModel>>({
        pagination: {
            current: 1,
            pageSize: 5,
            showSizeChanger: false
        }
    });

    const { mutate: deleteLocationSearchHistory } = useDeleteLocationSearchHistory();

    const params = useMemo(() => {
        const result: GetListLocationSearchHistoryParams = {
            location_id: locationId,
            page: tableParams.pagination.current,
            page_size: tableParams.pagination?.pageSize,
            ordering: "desc",
            order_by: "updated_at"
        };
        return result;
    }, [tableParams.pagination]);
    const { showModal } = useFormModal();
    const { showModal: showActionModal } = useActionModal();

    const { data: LocationSearchHistoryData, isLoading } = useGetLocationSearchHistoryList(params);
    const dataSource = useMemo<DataSourceItem<LocationSearchHistoryModel>[]>(() => {
        return (
            LocationSearchHistoryData?.founds.map((rentalRequest) => ({
                ...rentalRequest,
                key: rentalRequest.id
            })) || []
        );
    }, [LocationSearchHistoryData]);

    const onDelete = useCallback(
        function (id: string) {
            showActionModal({
                content: "Are you sure you want to delete this Location?",
                onOk: () => {
                    deleteLocationSearchHistory(id, {
                        onSuccess: () => {
                            showModal({
                                type: "success",
                                content: c("Location has been deleted successfully")
                            });
                        },
                        onError: (error) => {
                            if (axios.isAxiosError(error)) {
                                showModal({
                                    type: "warning",
                                    content: error.response?.data.detail
                                });
                            } else {
                                showModal({
                                    type: "warning",
                                    content: c(error?.message)
                                });
                            }
                        }
                    });
                }
            });
        },
        [deleteLocationSearchHistory, showModal, showActionModal]
    );

    const defaultColumns = React.useMemo<CustomColumnsType<LocationSearchHistoryModel, { no: number }>>(
        () => [
            {
                key: "no",
                title: c("No."),
                width: "6%",
                dataIndex: "no",
                render: (_text, _record, index) => index + 1
            },
            {
                key: "user_id",
                title: c("User ID"),
                dataIndex: "user_id",
                width: "44%"
            },
            {
                key: "updated_at",
                title: c("Most Recent Searched At"),
                dataIndex: "updated_at",
                width: "44%"
            },
            {
                key: "action",
                title: c(""),
                dataIndex: "action",
                width: "6%",
                render: (_text, record) => (
                    <DeleteOutlined
                        style={{
                            fontSize: 18,
                            color: "#d66f6f"
                        }}
                        onClick={() => {
                            onDelete(record.id);
                        }}
                    />
                )
            }
        ],
        []
    );

    return (
        <Flex
            style={{
                padding: "24px"
            }}
            vertical
            gap={8}>
            <TableV1
                rowKey={(row) => row.id}
                dataSource={dataSource}
                columns={defaultColumns}
                tableTitle={c("Location Search History")}
                pagination={tableParams.pagination}
                loading={isLoading}
                bordered
                onChange={(pagination, filters, sorter) => handleTableChange({ pagination, filters, sorter })}
            />
        </Flex>
    );
}
