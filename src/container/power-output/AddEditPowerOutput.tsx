import { PowerOutputPayload } from "@/interfaces/power-output";
import useGeneratePowerOutputFields from "./useGeneratePowerOutputFields";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PowerOutputFormSchema } from "./form-schema";
import {
    useCreatePowerOutput,
    useDeletePowerOutput,
    useGetPowerOutput,
    useUpdatePowerOutput
} from "@/hook/power-output-hook";
import { useFormModal } from "@/HOC/FormModalWrapper";
import { useActionModal } from "@/HOC/ConfirmModalWrapper";
import React, { useCallback, useEffect } from "react";
import SectionWrapper from "@/components/SectionWrapper";
import { FormWrapper } from "@/components/form/FormWrapper";
import { Form } from "antd";
import PowerOutputForm from "./PowerOutputForm";
import { useRouter } from "@/hook/router";
import { c } from "@/utils/string";
import axios from "axios";

interface AddEditPowerOutputProps {
    powerOutputId?: string;
    onAdd?: (powerOutput: PowerOutputPayload) => void;
    onEdit?: (powerOutput: PowerOutputPayload) => void;
    onCancel?: () => void;
}

export default function AddEditPowerOutput(props: AddEditPowerOutputProps): React.JSX.Element {
    const methods = useForm<PowerOutputPayload>({
        mode: "onBlur",
        resolver: yupResolver(PowerOutputFormSchema)
    });
    const fields = useGeneratePowerOutputFields(methods);

    const { mutate: createPowerOutput } = useCreatePowerOutput();
    const { data: powerOutputData, isLoading } = useGetPowerOutput(props.powerOutputId);
    const { mutate: updatePowerOutput } = useUpdatePowerOutput();
    const { mutate: deletePowerOutput } = useDeletePowerOutput();
    const { showModal } = useFormModal();
    const {
        showModal: showActionModal,
        toggleLoading: toggleActionModalLoading,
        closeModal: closeActionModal
    } = useActionModal();

    useEffect(() => {
        if (powerOutputData) {
            methods.reset(powerOutputData);
        }
    }, [powerOutputData]);

    function onSubmit(data: PowerOutputPayload) {
        showActionModal({
            content: `Are you sure you want to ${props.powerOutputId ? "update" : "create"} this Power Output?`,
            onOk: () => onConfirm(data),
            autoCloseModal: false
        });
    }

    const router = useRouter();

    const handleSuccess = (message: string, redirectToList?: boolean) => {
        closeActionModal();
        showModal({
            type: "success",
            content: message,
            onClose: () => {
                methods.reset();
                if (redirectToList) router.push(router.paths.get("power-outputs"), { force: true });
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

    const handleUpdate = (data: PowerOutputPayload) => {
        updatePowerOutput(
            { ...data, id: props.powerOutputId as string },
            {
                onSuccess: () => handleSuccess("Power Output has been updated successfully"),
                onError: handleError
            }
        );
    };

    const handleCreate = (data: PowerOutputPayload) => {
        createPowerOutput(data, {
            onSuccess: () => handleSuccess("Power Output has been created successfully"),
            onError: handleError
        });
    };

    const onConfirm = (data: PowerOutputPayload) => {
        toggleActionModalLoading(true);
        if (props.powerOutputId) {
            handleUpdate(data);
        } else {
            handleCreate(data);
        }
    };

    const handleDelete = (id: string) => {
        deletePowerOutput(id, {
            onSuccess: () => handleSuccess("Power Output has been created successfully", true),
            onError: handleError
        });
    };

    const onDeleteConfirm = (id: string) => {
        toggleActionModalLoading(true);
        handleDelete(id);
    };

    const onDelete = useCallback(
        (id: string) => {
            showActionModal({
                content: `Are you sure you want to delete this Power Output?`,
                autoCloseModal: false,
                onOk: () => onDeleteConfirm(id)
            });
        },
        [deletePowerOutput, showModal, showActionModal]
    );

    return (
        <>
            <SectionWrapper
                width="100%"
                loading={isLoading}
                sectionLabel={`${props.powerOutputId ? "Edit" : "Add"} Power Output`}>
                <FormWrapper fields={fields} methods={methods}>
                    <Form onReset={() => methods.reset()} onFinish={methods.handleSubmit(onSubmit)}>
                        <PowerOutputForm
                            powerOutputId={props.powerOutputId}
                            onClickDelete={() => {
                                props.powerOutputId && onDelete(props.powerOutputId);
                            }}
                        />
                    </Form>
                </FormWrapper>
            </SectionWrapper>
        </>
    );
}
