import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CustomColumnsType, DataSourceItem, TableChangeParams, TableParams } from "@/interfaces/table";
import { GetListPowerOutputParams, PowerOutputModel } from "@/interfaces/power-output";
import { useRouter } from "@/hook/router";
import { useDeletePowerOutput, useGetPowerOutputList } from "@/hook/power-output-hook";
import { useFormModal } from "@/HOC/FormModalWrapper";
import { useActionModal } from "@/HOC/ConfirmModalWrapper";
import { c } from "@/utils/string";
import TableActionDropdown from "@/components/Dropdown/TableActionDropdown";
import SectionWrapper from "@/components/SectionWrapper";
import Link from "next/link";
import SharedButton from "@/components/button/SharedButton";
import TableV1 from "@/components/TableV1";
import axios from "axios";

function PowerOutputList(): React.JSX.Element {
    const [tableParams, setTableParams] = useState<TableParams<PowerOutputModel>>({
        pagination: {
            current: 1,
            pageSize: 5,
            showSizeChanger: false
        }
    });

    const router = useRouter();

    const handleTableChange = ({ pagination, filters, sorter }: TableChangeParams<PowerOutputModel>) => {
        if (Array.isArray(sorter)) return;

        setTableParams({ pagination, filters, sorter });
    };

    const { mutate: deletePowerOutput } = useDeletePowerOutput();

    const params = useMemo(() => {
        const result: GetListPowerOutputParams = {
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

    const { data: powerOutputData } = useGetPowerOutputList(params);

    const dataSource = useMemo<DataSourceItem<PowerOutputModel>[]>(() => {
        return (
            powerOutputData?.founds.map((powerOutput) => ({
                ...powerOutput,
                key: powerOutput.id
            })) || []
        );
    }, [powerOutputData]);

    const onDelete = useCallback(
        function (id: string) {
            showActionModal({
                content: "Are you sure you want to delete this power output?",
                autoCloseModal: false,
                onOk: () => {
                    toggleActionModalLoading(true);
                    deletePowerOutput(id, {
                        onSuccess: () => {
                            closeActionModal();
                            showModal({
                                type: "success",
                                content: "Power Output has been deleted successfully"
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
        [deletePowerOutput, showModal, showActionModal, toggleActionModalLoading, closeActionModal]
    );

    useEffect(() => {
        if (!powerOutputData) return;

        setTableParams((prev) => {
            const current = prev.pagination.current || 1;
            const pageSize = prev.pagination.pageSize || 5;
            return {
                ...prev,
                pagination: {
                    ...prev.pagination,
                    total: powerOutputData?.search_options.total_count || 0,
                    current:
                        current > 1 && powerOutputData?.search_options?.total_count === pageSize * (current - 1)
                            ? current - 1
                            : current
                }
            };
        });
    }, [powerOutputData]);

    const defaultColumns = useMemo<CustomColumnsType<PowerOutputModel, { index: number }>>(
        () => [
            {
                key: "id",
                title: c("NO."),
                width: "10%",
                dataIndex: "index",
                render: (_text, _record, index) =>
                    index + 1 + (tableParams?.pagination?.pageSize || 0) * ((tableParams?.pagination?.current || 0) - 1)
            },
            {
                key: "output_value",
                title: c("Output Value (kW)"),
                dataIndex: "output_value",
                render: (text) => <span>{text} kW</span>
            },
            {
                key: "charging_speed",
                title: c("Charging Speed"),
                dataIndex: "charging_speed",
                render: (text) => <span>{text}</span>
            },
            {
                key: "voltage",
                title: c("Voltage (V)"),
                dataIndex: "voltage",
                render: (text) => <span>{text} V</span>
            },
            {
                key: "description",
                title: c("Description"),
                ellipsis: true,
                width: "30%",
                dataIndex: "description",
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
                            router.push(router.paths.get("edit-power-output", { pathParams: [record.id] }))
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
                <Link href={router.paths.get("add-power-output")} style={{ marginBottom: 24 }}>
                    <SharedButton title={c("Add Power Output")} customType="action" customSize="sm" />
                </Link>
            </div>
            <TableV1
                dataSource={dataSource}
                columns={defaultColumns}
                tableTitle={c("Power Output")}
                pagination={tableParams.pagination}
                onChange={(pagination, filters, sorter) => handleTableChange({ pagination, filters, sorter })}
            />
        </SectionWrapper>
    );
}

export default PowerOutputList;
