"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import TableV1 from "@/components/TableV1";
import { CustomColumnsType, DataSourceItem, TableChangeParams, TableParams } from "@/interfaces/table";
import { GetListLocationParams, LocationModel } from "@/interfaces/location";
import { c } from "@/utils/string";
import { useDeleteLocation, useGetLocationList } from "@/hook/location-hook";
import { useRouter } from "@/hook/router";
import { Flex, Tag } from "antd";
import Link from "next/link";
import SharedButton from "@/components/button/SharedButton";
import { useFormModal } from "@/HOC/FormModalWrapper";
import { useActionModal } from "@/HOC/ConfirmModalWrapper";
import TableActionDropdown from "@/components/Dropdown/TableActionDropdown";
import SectionWrapper from "@/components/SectionWrapper";
import axios from "axios";

export default function LocationList(): React.JSX.Element {
    const router = useRouter();

    const handleTableChange = ({ pagination, filters, sorter }: TableChangeParams<LocationModel>) => {
        if (Array.isArray(sorter)) return;
        setTableParams({
            pagination,
            filters,
            sorter
        });
    };

    const [tableParams, setTableParams] = useState<TableParams<LocationModel>>({
        pagination: {
            current: 1,
            pageSize: 5,
            showSizeChanger: false
        }
    });

    const { mutate: deleteLocation } = useDeleteLocation();

    const params = useMemo(() => {
        const result: GetListLocationParams = {
            page: tableParams.pagination.current,
            page_size: tableParams.pagination?.pageSize,
            ordering: "desc",
            order_by: "updated_at"
        };
        return result;
    }, [tableParams.pagination]);
    const { showModal } = useFormModal();
    const {
        showModal: showActionModal,
        toggleLoading: toggleActionModalLoading,
        closeModal: closeActionModal
    } = useActionModal();

    const { data: LocationData, isLoading } = useGetLocationList(params);
    const dataSource = useMemo<DataSourceItem<LocationModel>[]>(() => {
        return (
            LocationData?.founds.map((rentalRequest) => ({
                ...rentalRequest,
                key: rentalRequest.id
            })) || []
        );
    }, [LocationData]);

    const onDelete = useCallback(
        function (id: string) {
            showActionModal({
                content: "Are you sure you want to delete this Location?",
                autoCloseModal: false,
                onOk: () => {
                    toggleActionModalLoading(true);
                    deleteLocation(id, {
                        onSuccess: () => {
                            closeActionModal();
                            showModal({
                                type: "success",
                                content: c("Location has been deleted successfully")
                            });
                        },
                        onError: (error) => {
                            closeActionModal();
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
        [deleteLocation, showModal, showActionModal, toggleActionModalLoading, closeActionModal]
    );

    useEffect(() => {
        if (!LocationData) return;

        setTableParams((prev) => {
            const current = prev.pagination.current || 1;
            const pageSize = prev.pagination.pageSize || 5;
            return {
                ...prev,
                pagination: {
                    ...prev.pagination,
                    total: LocationData?.search_options?.total_count,
                    current:
                        current > 1 && LocationData?.search_options?.total_count === pageSize * (current - 1)
                            ? current - 1
                            : current
                }
            };
        });
    }, [LocationData]);

    const defaultColumns = useMemo<CustomColumnsType<LocationModel, { index: number }>>(
        () => [
            {
                key: "index",
                title: c("NO."),
                dataIndex: "index",
                width: 50,
                render: (_text, _record, index) =>
                    index + 1 + (tableParams?.pagination?.pageSize || 0) * ((tableParams?.pagination?.current || 0) - 1)
            },
            {
                title: c("Location Name"),
                dataIndex: "location_name",
                width: 160,
                key: "location_name",
                align: "left"
            },
            {
                title: c("Street Address Name"),
                dataIndex: "street",
                key: "street",
                width: 160,
                align: "left"
            },
            {
                title: c("District"),
                dataIndex: "district",
                key: "district",
                width: 80,
                align: "left"
            },
            {
                title: c("City/Province"),
                dataIndex: "city",
                key: "city",
                width: 120,
                align: "left"
            },
            {
                title: c("Amenities"),
                dataIndex: "location_amenities",
                width: 160,
                key: "location_amenities",
                align: "left",
                render: (_text, record) => (
                    <Flex gap={8} wrap>
                        {record.location_amenities?.map((item) => {
                            return (
                                <Tag style={{ margin: "0" }} key={item.id} color="success">
                                    {item.amenities.amenities_types}
                                </Tag>
                            );
                        })}
                    </Flex>
                )
            },
            {
                title: c("Latitude"),
                dataIndex: "latitude",
                key: "latitude",
                width: 100,
                render: (text) => <span>{text}</span>
            },
            {
                title: c("Longitude"),
                dataIndex: "longitude",
                key: "longitude",
                width: 100,
                render: (text) => <span>{text}</span>
            },
            {
                key: "action",
                title: c("Action"),
                dataIndex: "action",
                width: 60,
                fixed: "right",
                render: (_, record) => (
                    <TableActionDropdown
                        onClickEdit={() => {
                            router.push(
                                router.paths.get("edit-location", {
                                    pathParams: [record.id]
                                })
                            );
                        }}
                        onClickDelete={() => onDelete(record.id)}
                    />
                )
            }
        ],
        [tableParams, onDelete, router]
    );

    return (
        <SectionWrapper width="100%">
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end"
                }}>
                <Link
                    href={router.paths.get("add-location")}
                    style={{
                        marginBottom: 24
                    }}>
                    <SharedButton title={c("Add Location")} customType="action" customSize="sm" />
                </Link>
            </div>
            <TableV1
                columns={defaultColumns}
                dataSource={dataSource}
                tableTitle={c("Locations")}
                pagination={tableParams.pagination}
                loading={isLoading}
                scroll={{ x: 1920 }}
                bordered
                onChange={(pagination, filters, sorter) => handleTableChange({ pagination, filters, sorter })}
            />
        </SectionWrapper>
    );
}
