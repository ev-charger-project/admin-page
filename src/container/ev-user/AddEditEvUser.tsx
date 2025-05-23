import { EvUserPayload } from "@/interfaces/ev-user";
import useGenerateEvUserFields from "./useGenerateEvUserFields";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { EvUserFormSchema } from "./form-schema";
import { useCreateEvUser, useDeleteEvUser, useGetEvUser, useUpdateEvUser } from "@/hook/ev-user";
import { useFormModal } from "@/HOC/FormModalWrapper";
import { useActionModal } from "@/HOC/ConfirmModalWrapper";
import React, { useCallback, useEffect } from "react";
import SectionWrapper from "@/components/SectionWrapper";
import { FormWrapper } from "@/components/form/FormWrapper";
import { Form } from "antd";
import EvUserForm from "./EvUserForm";
import { useRouter } from "@/hook/router";
import { c } from "@/utils/string";
import axios from "axios";

interface AddEditEvUserProps {
    EvUserId?: string;
    onAdd?: (EvUser: EvUserPayload) => void;
    onEdit?: (EvUser: EvUserPayload) => void;
    onCancel?: () => void;
}

export default function AddEditEvUser(props: AddEditEvUserProps): React.JSX.Element {
    const fields = useGenerateEvUserFields();
    const methods = useForm<EvUserPayload>({
        mode: "onBlur",
        resolver: yupResolver(EvUserFormSchema)
    });

    const { mutate: createEvUser } = useCreateEvUser();
    const { data: EvUserData, isLoading } = useGetEvUser(props.EvUserId);
    const { mutate: updateEvUser } = useUpdateEvUser();
    const { mutate: deleteEvUser } = useDeleteEvUser();
    const { showModal } = useFormModal();
    const {
        showModal: showActionModal,
        toggleLoading: toggleActionModalLoading,
        closeModal: closeActionModal
    } = useActionModal();

    useEffect(() => {
        if (EvUserData) {
            methods.reset(EvUserData);
        }
    }, [EvUserData]);

    function onSubmit(data: EvUserPayload) {
        showActionModal({
            content: `Are you sure you want to ${props.EvUserId ? "update" : "create"} this User?`,
            autoCloseModal: false,
            onOk: () => onConfirm(data)
        });
    }

    const handleSuccess = (message: string) => {
        closeActionModal();
        showModal({
            type: "success",
            content: message,
            onClose: () => {
                methods.reset();
            }
        });
    };

    const handleError = (error: any) => {
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
    };

    const handleUpdate = (data: EvUserPayload) => {
        updateEvUser(
            { ...data, id: props.EvUserId as string },
            {
                onSuccess: () => handleSuccess("User has been updated successfully"),
                onError: handleError
            }
        );
    };

    const handleCreate = (data: EvUserPayload) => {
        createEvUser(data, {
            onSuccess: () => handleSuccess("User has been created successfully"),
            onError: handleError
        });
    };

    const onConfirm = (data: EvUserPayload) => {
        toggleActionModalLoading(true);
        if (props.EvUserId) {
            handleUpdate(data);
        } else {
            handleCreate(data);
        }
    };

    const router = useRouter();
    const onDelete = useCallback(
        (id: string) => {
            showActionModal({
                content: `Are you sure you want to delete this User?`,
                autoCloseModal: false,
                onOk: () => {
                    toggleActionModalLoading(true);
                    deleteEvUser(id, {
                        onSuccess: () => {
                            closeActionModal();
                            showModal({
                                type: "success",
                                content: c(`User has been delete successfully`),
                                onClose: () => {
                                    router.push(router.paths.get("users"));
                                }
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

    return (
        <>
            <SectionWrapper width="100%" loading={isLoading} sectionLabel={`${props.EvUserId ? "Edit" : "Add"} User`}>
                <FormWrapper fields={fields} methods={methods}>
                    <Form onReset={() => methods.reset()} onFinish={methods.handleSubmit(onSubmit)}>
                        <EvUserForm
                            userId={props.EvUserId}
                            onClickDelete={() => {
                                props.EvUserId && onDelete(props.EvUserId);
                            }}
                        />
                    </Form>
                </FormWrapper>
            </SectionWrapper>
        </>
    );
}
