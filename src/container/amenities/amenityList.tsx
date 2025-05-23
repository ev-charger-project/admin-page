"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import TableV1 from "@/components/TableV1";
import { CustomColumnsType, DataSourceItem, TableChangeParams, TableParams } from "@/interfaces/table";
import { GetListAmenityParams, AmenityModel } from "@/interfaces/amenity";
import { c } from "@/utils/string";
import { useDeleteAmenity, useGetAmenityList } from "@/hook/amenity-hook";
import { useRouter } from "@/hook/router";
import Link from "next/link";
import SharedButton from "@/components/button/SharedButton";
import { useFormModal } from "@/HOC/FormModalWrapper";
import { useActionModal } from "@/HOC/ConfirmModalWrapper";
import TableActionDropdown from "@/components/Dropdown/TableActionDropdown";
import SectionWrapper from "@/components/SectionWrapper";
import { Image } from "antd";
import axios from "axios";

export default function AmenityList(): React.JSX.Element {
    const router = useRouter();

    const handleTableChange = ({ pagination, filters, sorter }: TableChangeParams<AmenityModel>) => {
        if (Array.isArray(sorter)) return;
        setTableParams({
            pagination,
            filters,
            sorter
        });
    };

    const [tableParams, setTableParams] = useState<TableParams<AmenityModel>>({
        pagination: {
            current: 1,
            pageSize: 5,
            showSizeChanger: false
        }
    });

    const { mutate: deleteAmenity } = useDeleteAmenity();

    const params = useMemo(() => {
        const result: GetListAmenityParams = {
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

    const { data: AmenityData, isLoading } = useGetAmenityList(params);
    const dataSource = useMemo<DataSourceItem<AmenityModel>[]>(() => {
        return (
            AmenityData?.founds.map((rentalRequest) => ({
                ...rentalRequest,
                key: rentalRequest.id
            })) || []
        );
    }, [AmenityData]);

    const onDelete = useCallback(
        function (id: string) {
            showActionModal({
                content: "Are you sure you want to delete this Amenity?",
                autoCloseModal: false,
                onOk: () => {
                    toggleActionModalLoading(true);
                    deleteAmenity(id, {
                        onSuccess: () => {
                            closeActionModal();
                            showModal({
                                type: "success",
                                content: c("Amenity has been deleted successfully")
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
        [deleteAmenity, showModal, showActionModal]
    );

    useEffect(() => {
        if (!AmenityData) return;

        setTableParams((prev) => {
            const current = prev.pagination.current || 1;
            const pageSize = prev.pagination.pageSize || 5;
            return {
                ...prev,
                pagination: {
                    ...prev.pagination,
                    total: AmenityData?.search_options?.total_count,
                    current:
                        current > 1 && AmenityData?.search_options?.total_count === pageSize * (current - 1)
                            ? current - 1
                            : current
                }
            };
        });
    }, [AmenityData]);

    const defaultColumns = useMemo<CustomColumnsType<AmenityModel, { index: number }>>(
        () => [
            {
                key: "index",
                title: c("NO."),
                dataIndex: "index",
                width: "10%",
                render: (_text, _record, index) =>
                    index + 1 + (tableParams?.pagination?.pageSize || 0) * ((tableParams?.pagination?.current || 0) - 1)
            },
            {
                title: c("Amenity Name"),
                dataIndex: "amenities_types",
                key: "amenities_types",
                align: "left"
            },
            {
                title: c("Amenity Image"),
                dataIndex: "image_url",
                width: "10%",
                key: "image_url",
                render: (text) =>
                    text && (
                        <Image
                            src={`${process.env.NEXT_PUBLIC_EV_CHARGER_SERVICE_BASE_URL}/api/v1/media/${text}`}
                            alt="Amenity Image"
                        />
                    )
            },
            {
                key: "action",
                title: c("Action"),
                dataIndex: "action",
                width: "10%",
                fixed: "right",
                render: (_, record) => (
                    <TableActionDropdown
                        onClickEdit={() => {
                            router.push(
                                router.paths.get("edit-amenities", {
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
                    href={router.paths.get("add-amenities")}
                    style={{
                        marginBottom: 24
                    }}>
                    <SharedButton title={c("Add Amenity")} customType="action" customSize="sm" />
                </Link>
            </div>
            <TableV1
                columns={defaultColumns}
                dataSource={dataSource}
                tableTitle={c("Amenities")}
                pagination={tableParams.pagination}
                loading={isLoading}
                bordered
                onChange={(pagination, filters, sorter) => handleTableChange({ pagination, filters, sorter })}
            />
        </SectionWrapper>
    );
}
