import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CustomColumnsType, DataSourceItem, TableChangeParams, TableParams } from "@/interfaces/table";
import { GetListEVChargerParams, EVChargerModel } from "@/interfaces/ev-charger";
import { useRouter } from "@/hook/router";
import { useFormModal } from "@/HOC/FormModalWrapper";
import { useActionModal } from "@/HOC/ConfirmModalWrapper";
import { c } from "@/utils/string";
import TableActionDropdown from "@/components/Dropdown/TableActionDropdown";
import SectionWrapper from "@/components/SectionWrapper";
import Link from "next/link";
import SharedButton from "@/components/button/SharedButton";
import TableV1 from "@/components/TableV1";
import { useDeleteEVCharger, useGetEVChargerList } from "@/hook/ev-charger-hooks";
import axios from "axios";

function EVChargerList(): React.JSX.Element {
    const [tableParams, setTableParams] = useState<TableParams<EVChargerModel>>({
        pagination: {
            current: 1,
            pageSize: 5,
            showSizeChanger: false
        }
    });

    const router = useRouter();

    const handleTableChange = ({ pagination, filters, sorter }: TableChangeParams<EVChargerModel>) => {
        if (Array.isArray(sorter)) return;

        setTableParams({ pagination, filters, sorter });
    };

    const { mutate: deleteEVCharger } = useDeleteEVCharger();

    const params = useMemo(() => {
        const result: GetListEVChargerParams = {
            page: tableParams.pagination.current,
            page_size: tableParams.pagination?.pageSize,
            ordering: "desc",
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

    const { data: EVChargerData } = useGetEVChargerList(params);

    const dataSource = useMemo<DataSourceItem<EVChargerModel>[]>(() => {
        return (
            EVChargerData?.founds.map((EVCharger) => ({
                ...EVCharger,
                key: EVCharger.id
            })) || []
        );
    }, [EVChargerData]);

    const onDelete = useCallback(
        function (id: string) {
            showActionModal({
                content: "Are you sure you want to delete this power output?",
                autoCloseModal: false,
                onOk: () => {
                    toggleActionModalLoading(true);
                    deleteEVCharger(id, {
                        onSuccess: () => {
                            closeActionModal();
                            showModal({
                                type: "success",
                                content: "EV Charger has been deleted successfully"
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
        [deleteEVCharger, showModal, showActionModal, closeActionModal, toggleActionModalLoading]
    );

    useEffect(() => {
        if (!EVChargerData) return;

        setTableParams((prev) => {
            const current = prev.pagination.current || 1;
            const pageSize = prev.pagination.pageSize || 5;
            return {
                ...prev,
                pagination: {
                    ...prev.pagination,
                    total: EVChargerData?.search_options.total_count || 0,
                    current:
                        current > 1 && EVChargerData?.search_options?.total_count === pageSize * (current - 1)
                            ? current - 1
                            : current
                }
            };
        });
    }, [EVChargerData]);

    const defaultColumns = useMemo<CustomColumnsType<EVChargerModel, { index: number }>>(
        () => [
            {
                key: "index",
                title: c("NO."),
                width: "10%",
                dataIndex: "index",
                render: (_text, record, index) =>
                    index + 1 + (tableParams?.pagination?.pageSize || 0) * ((tableParams?.pagination?.current || 0) - 1)
            },
            {
                key: "station_name",
                title: c("Station Name"),
                width: "20%",
                dataIndex: "station_name",
                render: (text) => <span>{text}</span>
            },
            {
                key: "location",
                title: c("Location"),
                ellipsis: true,
                dataIndex: "location",
                render: (value) => <span>{value.location_name}</span>
            },
            {
                key: "installation_date",
                title: c("Installation Date"),
                dataIndex: "installation_date",
                render: (text) => <span>{text}</span>
            },
            {
                key: "last_maintenance_date",
                title: c("Last Maintenace Date"),
                dataIndex: "last_maintenance_date",
                render: (text) => <span>{text}</span>
            },
            {
                key: "action",
                title: c("Action"),
                dataIndex: "action",
                width: "10%",
                fixed: "right",
                render: (_, record) => (
                    <TableActionDropdown
                        onClickEdit={() =>
                            router.push(router.paths.get("edit-ev-charger", { pathParams: [record.id] }))
                        }
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
                <Link href={router.paths.get("add-ev-charger")} style={{ marginBottom: 24 }}>
                    <SharedButton title={c("Add EV Charger")} customType="action" customSize="sm" />
                </Link>
            </div>
            <TableV1
                dataSource={dataSource}
                columns={defaultColumns}
                tableTitle={c("EV Charger")}
                pagination={tableParams.pagination}
                onChange={(pagination, filters, sorter) => handleTableChange({ pagination, filters, sorter })}
            />
        </SectionWrapper>
    );
}

export default EVChargerList;
