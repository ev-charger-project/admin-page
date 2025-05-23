import { CreateEVChargerPayload } from "@/interfaces/ev-charger";
import useGenerateEVChargerFields from "./useGenerateEVChargerFields";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { EVChargerFormSchema } from "./form-schema";
import { useFormModal } from "@/HOC/FormModalWrapper";
import { useActionModal } from "@/HOC/ConfirmModalWrapper";
import React, { useCallback, useEffect } from "react";
import SectionWrapper from "@/components/SectionWrapper";
import { FormWrapper } from "@/components/form/FormWrapper";
import { Form } from "antd";
import EVChargerForm from "./EVChargerForm";
import { useRouter } from "@/hook/router";
import { c } from "@/utils/string";
import { useCreateEVCharger, useDeleteEVCharger, useGetEVCharger, useUpdateEVCharger } from "@/hook/ev-charger-hooks";
import axios from "axios";

interface AddEditEVChargerProps {
    EVChargerId?: string;
    onAdd?: (EVCharger: CreateEVChargerPayload) => void;
    onEdit?: (EVCharger: CreateEVChargerPayload) => void;
    onCancel?: () => void;
}

export default function AddEditEVCharger(props: AddEditEVChargerProps): React.JSX.Element {
    const methods = useForm<CreateEVChargerPayload>({
        mode: "onBlur",
        resolver: yupResolver(EVChargerFormSchema)
    });
    const fields = useGenerateEVChargerFields(methods);

    const { mutate: createEVCharger } = useCreateEVCharger();
    const { data: EVChargerData, isLoading } = useGetEVCharger(props.EVChargerId);
    const { mutate: updateEVCharger } = useUpdateEVCharger();
    const { mutate: deleteEVCharger } = useDeleteEVCharger();
    const { showModal } = useFormModal();
    const {
        showModal: showActionModal,
        toggleLoading: toggleActionModalLoading,
        closeModal: closeActionModal
    } = useActionModal();

    useEffect(() => {
        if (EVChargerData) {
            methods.reset(EVChargerData);
        }
    }, [EVChargerData]);

    function onSubmit(data: CreateEVChargerPayload) {
        showActionModal({
            content: `Are you sure you want to ${props.EVChargerId ? "update" : "create"} this EV Charger?`,
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

    const handleUpdate = (data: CreateEVChargerPayload) => {
        updateEVCharger(
            { ...data, id: props.EVChargerId as string },
            {
                onSuccess: () => handleSuccess("EV Charger has been updated successfully"),
                onError: handleError
            }
        );
    };

    const handleCreate = (data: CreateEVChargerPayload) => {
        createEVCharger(data, {
            onSuccess: () => {
                handleSuccess("EV Charger has been created successfully");
            },
            onError: handleError
        });
    };

    const onConfirm = (data: CreateEVChargerPayload) => {
        toggleActionModalLoading(true);
        if (props.EVChargerId) {
            handleUpdate(data);
        } else {
            handleCreate(data);
        }
    };

    const router = useRouter();
    const onDelete = useCallback(
        (id: string) => {
            showActionModal({
                content: `Are you sure you want to delete this EV Charger?`,
                autoCloseModal: false,
                onOk: () => {
                    toggleActionModalLoading(true);
                    deleteEVCharger(id, {
                        onSuccess: () => {
                            closeActionModal();
                            showModal({
                                type: "success",
                                content: c(`EV Charger has been delete successfully`),
                                onClose: () => {
                                    router.push(router.paths.get("ev-chargers"));
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
        [deleteEVCharger, showModal, showActionModal, toggleActionModalLoading, closeActionModal]
    );

    return (
        <>
            <SectionWrapper
                width="100%"
                loading={isLoading}
                sectionLabel={`${props.EVChargerId ? "Edit" : "Add"} EV Charger`}>
                <FormWrapper fields={fields} methods={methods}>
                    <Form onReset={() => methods.reset()} onFinish={methods.handleSubmit(onSubmit, () => {})}>
                        <EVChargerForm
                            EVChargerId={props.EVChargerId}
                            onClickDelete={() => {
                                props.EVChargerId && onDelete(props.EVChargerId);
                            }}
                            disableSubmit={!methods.formState.isValid}
                        />
                    </Form>
                </FormWrapper>
            </SectionWrapper>
        </>
    );
}
