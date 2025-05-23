import { PowerPlugTypePayload } from "@/interfaces/power-plug-type";
import { useForm } from "react-hook-form";
import {
    useCreatePowerPlugType,
    useDeletePowerPlugType,
    useGetPowerPlugType,
    useUpdatePowerPlugType
} from "@/hook/power-plug-type-hook";
import { useFormModal } from "@/HOC/FormModalWrapper";
import { Form } from "antd";
import { c } from "@/utils/string";
import SectionWrapper from "@/components/SectionWrapper";
import { FormWrapper } from "@/components/form/FormWrapper";
import React, { useCallback } from "react";
import useGeneratePowerPlugTypeFormField from "@/container/power-plug-type/useGeneratePowerPlugTypeFormField";
import PowerPlugTypeForm from "@/container/power-plug-type/PowerPlugTypeForm";
import { PowerPlugTypeFormSchema } from "@/container/power-plug-type/form-schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useActionModal } from "@/HOC/ConfirmModalWrapper";
import { useRouter } from "@/hook/router";
import axios from "axios";

interface AddEditPowerPlugTypeProps {
    powerPlugTypeId?: string;
    onAdd?: (powerPlugType: PowerPlugTypePayload) => void;
    onEdit?: (powerPlugType: PowerPlugTypePayload) => void;
    onCancel?: () => void;
}

function AddEditPowerPlugType(props: AddEditPowerPlugTypeProps): React.JSX.Element {
    const fields = useGeneratePowerPlugTypeFormField();
    const methods = useForm<PowerPlugTypePayload>({
        mode: "onBlur",
        resolver: yupResolver(PowerPlugTypeFormSchema)
    });
    const { mutate: createPowerPlugType } = useCreatePowerPlugType();
    const { data: powerPlugTypeData, isLoading } = useGetPowerPlugType(props.powerPlugTypeId);
    const { mutate: updatePowerPlugType } = useUpdatePowerPlugType();
    const { mutate: deletePowerPlugType } = useDeletePowerPlugType();
    const { showModal } = useFormModal();
    const {
        showModal: showActionModal,
        toggleLoading: toggleActionModalLoading,
        closeModal: closeActionModal
    } = useActionModal();
    React.useEffect(() => {
        if (!powerPlugTypeData) {
            return;
        }
        methods.reset(powerPlugTypeData);
    }, [powerPlugTypeData, methods]);

    function onSubmit(data: PowerPlugTypePayload) {
        showActionModal({
            content: `Are you sure you want to ${props.powerPlugTypeId ? "update" : "create"} this Power Plug Type?`,
            onOk: () => onConfirm(data)
        });
    }
    const router = useRouter();
    const onDelete = useCallback(
        (id: string) => {
            showActionModal({
                content: `Are you sure you want to delete this Power Plug Type?`,
                autoCloseModal: false,
                onOk: () => {
                    toggleActionModalLoading(true);
                    deletePowerPlugType(id, {
                        onSuccess: () => {
                            closeActionModal();
                            showModal({
                                type: "success",
                                content: c(`Power Plug Type has been delete successfully`),
                                onClose: () => {
                                    router.push(router.paths.get("power-plug-types"));
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
        [deletePowerPlugType, showModal, showActionModal, toggleActionModalLoading, closeActionModal]
    );

    function onConfirm(data: PowerPlugTypePayload) {
        toggleActionModalLoading(true);
        if (props.powerPlugTypeId) {
            updatePowerPlugType(
                {
                    ...data,
                    id: props.powerPlugTypeId
                },
                {
                    onSuccess: () => {
                        closeActionModal();
                        showModal({
                            type: "success",
                            content: c(
                                `Power Plug Type has been ${props.powerPlugTypeId ? "updated" : "created"} successfully`
                            ),
                            onClose: () => {
                                methods.reset();
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
                }
            );
        } else {
            createPowerPlugType(data, {
                onSuccess: () => {
                    closeActionModal();
                    showModal({
                        type: "success",
                        content: c(
                            `Power Plug Type has been ${props.powerPlugTypeId ? "updated" : "created"} successfully`
                        ),
                        onClose: () => {
                            methods.reset();
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
    }

    return (
        <>
            <SectionWrapper
                loading={isLoading}
                sectionLabel={`${props.powerPlugTypeId ? "Update" : "Create"} Power Plug Type`}
                width="100%">
                <FormWrapper methods={methods} fields={fields}>
                    <Form
                        onReset={() => {
                            methods.reset();
                        }}
                        onFinish={methods.handleSubmit(onSubmit)}>
                        <PowerPlugTypeForm
                            powerPlugTypeId={props.powerPlugTypeId}
                            onClickDelete={() => {
                                props.powerPlugTypeId && onDelete(props.powerPlugTypeId);
                            }}
                        />
                    </Form>
                </FormWrapper>
            </SectionWrapper>
        </>
    );
}

export default AddEditPowerPlugType;
