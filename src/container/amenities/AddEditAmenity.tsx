"use client";
import React, { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useFormModal } from "@/HOC/FormModalWrapper";
import { useRouter } from "@/hook/router";
import { Form } from "antd";
import { c } from "@/utils/string";
import SectionWrapper from "@/components/SectionWrapper";
import { FormWrapper } from "@/components/form/FormWrapper";
import { yupResolver } from "@hookform/resolvers/yup";
import useGenerateFields from "./useGenerateFields";
import { CreateAmenityPayload } from "@/interfaces/amenity";
import { addEditAmenitySchema } from "./form-schema";
import { useCreateAmenity, useDeleteAmenity, useGetAmenity, useUpdateAmenity } from "@/hook/amenity-hook";
import AmenityForm from "./AmenityForm";
import { useActionModal } from "@/HOC/ConfirmModalWrapper";
import axios from "axios";

interface AddEditAmenityProps {
    amenityId?: string;
}

export default function AddEditAmenity(props: AddEditAmenityProps): React.JSX.Element {
    const router = useRouter();
    const defaultValues: CreateAmenityPayload = useMemo(() => {
        return {
            amenities_types: "Dinner"
        } as CreateAmenityPayload;
    }, []);

    const methods = useForm<CreateAmenityPayload>({
        mode: "onBlur",
        resolver: yupResolver(addEditAmenitySchema),
        defaultValues
    });
    const fields = useGenerateFields();

    const { data: amenityData, isLoading } = useGetAmenity(props.amenityId);
    const { mutate: createAmenity } = useCreateAmenity();
    const { mutate: updateAmenity } = useUpdateAmenity();
    const { mutate: deleteAmenity } = useDeleteAmenity();
    const { showModal } = useFormModal();
    const {
        showModal: showActionModal,
        toggleLoading: toggleActionModalLoading,
        closeModal: closeActionModal
    } = useActionModal();

    useEffect(() => {
        if (!amenityData) {
            return;
        }
        methods.reset(amenityData);
    }, [amenityData, methods]);

    function onSubmit(data: CreateAmenityPayload) {
        showActionModal({
            content: `Are you sure you want to ${props.amenityId ? "update" : "create"} this Amenity?`,
            autoCloseModal: false,
            onOk: () => onConfirm(data)
        });
    }

    function onConfirm(data: CreateAmenityPayload) {
        toggleActionModalLoading(true);
        if (props.amenityId) {
            updateAmenity(
                {
                    ...data,
                    id: props.amenityId
                },
                {
                    onSuccess: () => {
                        closeActionModal();
                        showModal({
                            type: "success",
                            content: c(`Amenity has been ${props.amenityId ? "updated" : "created"} successfully`),
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
            createAmenity(data, {
                onSuccess: () => {
                    closeActionModal();
                    showModal({
                        type: "success",
                        content: c(`Amenity has been ${props.amenityId ? "updated" : "created"} successfully`),
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
                                content: c("Amenity has been deleted successfully"),
                                onClose: () => {
                                    methods.reset();
                                    router.push(router.paths.get("amenities"), { force: true });
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
        [deleteAmenity, showModal, showActionModal]
    );

    return (
        <>
            <SectionWrapper
                loading={isLoading}
                sectionLabel={`${props.amenityId ? "Update" : "Create"} Amenity`}
                width="100%">
                <FormWrapper methods={methods} fields={fields}>
                    <Form
                        onReset={() => {
                            methods.reset();
                        }}
                        onFinish={methods.handleSubmit(onSubmit)}>
                        <AmenityForm
                            editMode={!!props.amenityId}
                            onClickDelete={() => {
                                props.amenityId && onDelete(props.amenityId);
                            }}
                            disableSubmit={!methods.formState.isValid}
                        />
                    </Form>
                </FormWrapper>
            </SectionWrapper>
        </>
    );
}
