import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CustomColumnsType, DataSourceItem, TableChangeParams, TableParams } from "@/interfaces/table";
import { GetListEvUserParams, EvUserModel } from "@/interfaces/ev-user";
import { useRouter } from "@/hook/router";
import { useDeleteEvUser, useGetEvUserList } from "@/hook/ev-user";
import { useFormModal } from "@/HOC/FormModalWrapper";
import { useActionModal } from "@/HOC/ConfirmModalWrapper";
import { c } from "@/utils/string";
import TableActionDropdown from "@/components/Dropdown/TableActionDropdown";
import SectionWrapper from "@/components/SectionWrapper";
import Link from "next/link";
import SharedButton from "@/components/button/SharedButton";
import TableV1 from "@/components/TableV1";
import axios from "axios";
import { Tag } from "antd";

function EvUserList(): React.JSX.Element {
    const [tableParams, setTableParams] = useState<TableParams<EvUserModel>>({
        pagination: {
            current: 1,
            pageSize: 5,
            showSizeChanger: false
        }
    });

    const router = useRouter();

    const handleTableChange = ({ pagination, filters, sorter }: TableChangeParams<EvUserModel>) => {
        if (Array.isArray(sorter)) return;

        setTableParams({ pagination, filters, sorter });
    };

    const { mutate: deleteEvUser } = useDeleteEvUser();

    const params = useMemo(() => {
        const result: GetListEvUserParams = {
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

    const { data: EvUserData } = useGetEvUserList(params);

    const dataSource = useMemo<DataSourceItem<EvUserModel>[]>(() => {
        return (
            EvUserData?.founds.map((EvUser) => ({
                ...EvUser,
                key: EvUser.id
            })) || []
        );
    }, [EvUserData]);

    const onDelete = useCallback(
        function (id: string) {
            showActionModal({
                content: "Are you sure you want to delete this user?",
                autoCloseModal: false,
                onOk: () => {
                    toggleActionModalLoading(true);
                    deleteEvUser(id, {
                        onSuccess: () => {
                            closeActionModal();
                            showModal({
                                type: "success",
                                content: "User has been deleted successfully"
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
        [deleteEvUser, showModal, showActionModal, toggleActionModalLoading, closeActionModal]
    );

    useEffect(() => {
        if (!EvUserData) return;

        setTableParams((prev) => {
            const current = prev.pagination.current || 1;
            const pageSize = prev.pagination.pageSize || 5;
            return {
                ...prev,
                pagination: {
                    ...prev.pagination,
                    total: EvUserData?.search_options.total_count || 0,
                    current:
                        current > 1 && EvUserData?.search_options?.total_count === pageSize * (current - 1)
                            ? current - 1
                            : current
                }
            };
        });
    }, [EvUserData]);

    const defaultColumns = useMemo<CustomColumnsType<EvUserModel, { index: number }>>(
        () => [
            {
                key: "id",
                title: c("NO."),
                width: "10%",
                dataIndex: "index",
                render: (_text, record, index) =>
                    index + 1 + (tableParams?.pagination?.pageSize || 0) * ((tableParams?.pagination?.current || 0) - 1)
            },
            {
                key: "email",
                title: c("Email"),
                dataIndex: "email",
                render: (text) => text
            },
            {
                key: "name",
                title: c("Name"),
                dataIndex: "name",
                render: (text) => text
            },
            {
                key: "phone_number",
                title: c("Phone Number"),
                dataIndex: "phone_number"
            },
            {
                key: "is_active",
                title: c("Active"),
                dataIndex: "is_active",
                render: (text) =>
                    text ? (
                        <Tag style={{ margin: "0" }} color="success">
                            Active
                        </Tag>
                    ) : (
                        <Tag style={{ margin: "0" }} color="warning">
                            Inactive
                        </Tag>
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
                        onClickEdit={() => router.push(router.paths.get("edit-user", { pathParams: [record.id] }))}
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
                <Link href={router.paths.get("add-user")} style={{ marginBottom: 24 }}>
                    <SharedButton title={c("Add User")} customType="action" customSize="sm" />
                </Link>
            </div>
            <TableV1
                dataSource={dataSource}
                columns={defaultColumns}
                tableTitle={c("User")}
                pagination={tableParams.pagination}
                onChange={(pagination, filters, sorter) => handleTableChange({ pagination, filters, sorter })}
            />
        </SectionWrapper>
    );
}

export default EvUserList;
