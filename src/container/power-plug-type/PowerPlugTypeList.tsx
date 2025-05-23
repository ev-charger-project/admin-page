import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CustomColumnsType, DataSourceItem, TableChangeParams, TableParams } from "@/interfaces/table";
import { GetListPowerPlugTypeParams, PowerPlugTypeModel } from "@/interfaces/power-plug-type";
import { useRouter } from "@/hook/router";
import { useDeletePowerPlugType, useGetPowerPlugTypeList } from "@/hook/power-plug-type-hook";
import { useFormModal } from "@/HOC/FormModalWrapper";
import { c } from "@/utils/string";
import TableActionDropdown from "@/components/Dropdown/TableActionDropdown";
import SectionWrapper from "@/components/SectionWrapper";
import Link from "next/link";
import SharedButton from "@/components/button/SharedButton";
import TableV1 from "@/components/TableV1";
import { useActionModal } from "@/HOC/ConfirmModalWrapper";
import { Image } from "antd";
import axios from "axios";

function PowerPlugTypeList() {
    const [tableParams, setTableParams] = useState<TableParams<PowerPlugTypeModel>>({
        pagination: {
            current: 1,
            pageSize: 5,
            showSizeChanger: false
        }
    });
    const router = useRouter();

    const handleTableChange = ({ pagination, filters, sorter }: TableChangeParams<PowerPlugTypeModel>) => {
        if (Array.isArray(sorter)) {
            return;
        }
        setTableParams({
            pagination,
            filters,
            sorter
        });
    };
    const { mutate: deletePowerPlugType } = useDeletePowerPlugType();
    const params = useMemo(() => {
        const result: GetListPowerPlugTypeParams = {
            page: tableParams.pagination.current,
            page_size: tableParams.pagination?.pageSize,
            order_by: "created_at"
        };
        return result;
    }, [tableParams.pagination]);
    const { showModal } = useFormModal();
    const {
        showModal: showActionModal,
        toggleLoading: toggleActionModalLoading,
        closeModal: closeActionModal
    } = useActionModal();

    const { data: powerPlugTypeData } = useGetPowerPlugTypeList(params);
    const dataSource = useMemo<DataSourceItem<PowerPlugTypeModel>[]>(() => {
        return (
            powerPlugTypeData?.founds.map((rentalRequest) => ({
                ...rentalRequest,
                key: rentalRequest.id
            })) || []
        );
    }, [powerPlugTypeData]);

    const onDelete = useCallback(
        (id: string) => {
            showActionModal({
                content: c("Are you sure you want to delete this power plug type?"),
                autoCloseModal: false,
                onOk: () => {
                    toggleActionModalLoading(true);
                    deletePowerPlugType(id, {
                        onSuccess: () => {
                            closeActionModal();
                            showModal({
                                type: "success",
                                content: c(`Power Plug Type has been delete successfully`),
                                onClose: () => {}
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
        [deletePowerPlugType, showActionModal, showModal, toggleActionModalLoading, closeActionModal]
    );

    useEffect(() => {
        if (!powerPlugTypeData) {
            return;
        }

        setTableParams((prev) => {
            const current = prev.pagination.current || 1;
            const pageSize = prev.pagination.pageSize || 5;
            return {
                ...prev,
                pagination: {
                    ...prev.pagination,
                    total: powerPlugTypeData?.search_options?.total_count,
                    current:
                        current > 1 && powerPlugTypeData?.search_options?.total_count === pageSize * (current - 1)
                            ? current - 1
                            : current
                }
            };
        });
    }, [powerPlugTypeData]);

    const defaultColumns = useMemo<CustomColumnsType<PowerPlugTypeModel, { index: number }>>(
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
                key: "plug_type",
                title: c("Plug Type"),
                dataIndex: "plug_type",
                width: "10%",
                render: (text) => <span>{text}</span>
            },
            {
                key: "power_model",
                title: c("Power Model"),
                dataIndex: "power_model",
                width: "12%",
                render: (text) => <span>{text}</span>
            },
            {
                key: "plug_image_url",
                title: c("Plug Image"),
                dataIndex: "plug_image_url",
                width: "10%",
                render: (text) =>
                    text && (
                        <Image
                            src={`${process.env.NEXT_PUBLIC_EV_CHARGER_SERVICE_BASE_URL}/api/v1/media/${text}`}
                            alt="Plug Image"
                        />
                    )
            },
            {
                key: "power_plug_region",
                title: c("Power Plug Region"),
                dataIndex: "power_plug_region",
                width: "15%",
                render: (text) => <span>{text}</span>
            },
            {
                key: "additional_note",
                title: c("Additional Note"),
                ellipsis: true,
                dataIndex: "additional_note",
                render: (text) => <span>{text}</span>
            },
            {
                key: "action",
                title: c("Action"),
                fixed: "right",
                width: "10%",
                dataIndex: "action",
                render: (_, record) => (
                    <TableActionDropdown
                        onClickEdit={() => {
                            router.push(router.paths.get("edit-power-plug-type", { pathParams: [record.id] }));
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
                    href={router.paths.get("add-power-plug-type")}
                    style={{
                        marginBottom: 24
                    }}>
                    <SharedButton title={c("Add Power Plug Type")} customType="action" customSize="sm" />
                </Link>
            </div>
            <TableV1
                columns={defaultColumns}
                dataSource={dataSource}
                tableTitle={c("Power Plug Type")}
                pagination={tableParams.pagination}
                onChange={(pagination, filters, sorter) => handleTableChange({ pagination, filters, sorter })}
            />
        </SectionWrapper>
    );
}

export default PowerPlugTypeList;
