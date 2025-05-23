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
import { CreateLocationPayload } from "@/interfaces/location";
import { addEditLocationSchema } from "./form-schema";
import { useCreateLocation, useDeleteLocation, useGetLocation, useUpdateLocation } from "@/hook/location-hook";
import LocationForm from "./LocationForm";
import { useActionModal } from "@/HOC/ConfirmModalWrapper";
import axios from "axios";

interface AddEditLocationProps {
    locationId?: string;
}

export default function AddEditLocation(props: AddEditLocationProps): React.JSX.Element {
    const router = useRouter();
    const defaultValues: CreateLocationPayload = useMemo(() => {
        return {
            location_name: "Vincom Long Biên",
            street: "56 Hoàng Văn Thụ, Phường 6",
            city: "Thành phố Hồ Chí Minh",
            country: "Vietnam",
            latitude: 10.800249110036347,
            longitude: 106.66472026657279,
            working_days: [
                {
                    day: 1,
                    open_time: "08:00",
                    close_time: "18:00"
                },
                {
                    day: 2,
                    open_time: "08:00",
                    close_time: "18:00"
                },
                {
                    day: 3,
                    open_time: "08:00",
                    close_time: "18:00"
                },
                {
                    day: 4,
                    open_time: "08:00",
                    close_time: "18:00"
                },
                {
                    day: 5,
                    open_time: "08:00",
                    close_time: "18:00"
                },
                {
                    day: 6,
                    open_time: "09:30",
                    close_time: "12:00"
                },
                {
                    day: 7,
                    open_time: "09:30",
                    close_time: "12:00"
                }
            ]
        } as CreateLocationPayload;
    }, []);

    const methods = useForm<CreateLocationPayload>({
        mode: "onBlur",
        resolver: yupResolver(addEditLocationSchema),
        defaultValues
    });
    const fields = useGenerateFields(methods);

    const { data: locationData, isLoading } = useGetLocation(props.locationId);
    const { mutate: createLocation } = useCreateLocation();
    const { mutate: updateLocation } = useUpdateLocation();
    const { mutate: deleteLocation } = useDeleteLocation();
    const { showModal } = useFormModal();
    const {
        showModal: showActionModal,
        toggleLoading: toggleActionModalLoading,
        closeModal: closeActionModal
    } = useActionModal();

    useEffect(() => {
        if (!locationData) {
            return;
        }
        const working_days_form = defaultValues.working_days.map((item) => {
            const day = locationData.working_days.find((i) => i.day == item.day);
            return {
                day: item.day,
                open_time: day?.open_time || "",
                close_time: day?.close_time || ""
            };
        });

        const amenities_id = locationData.location_amenities?.map((item) => {
            return item.amenities.id;
        });
        methods.reset({ ...locationData, working_days: working_days_form, amenities_id: amenities_id });
    }, [locationData, methods]);

    function onSubmit(data: CreateLocationPayload) {
        showActionModal({
            content: `Are you sure you want to ${props.locationId ? "update" : "create"} this Location?`,
            onOk: () => {
                onConfirm({
                    ...data,
                    working_days: data.working_days.filter((i) => i.open_time !== "" && i.close_time !== "")
                });
            },
            autoCloseModal: false
        });
    }

    function onConfirm(data: CreateLocationPayload) {
        toggleActionModalLoading(true);
        if (props.locationId) {
            updateLocation(
                {
                    ...data,
                    id: props.locationId
                },
                {
                    onSuccess: () => {
                        closeActionModal();
                        showModal({
                            type: "success",
                            content: c(`Location has been ${props.locationId ? "updated" : "created"} successfully`),
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
            createLocation(data, {
                onSuccess: () => {
                    closeActionModal();
                    showModal({
                        type: "success",
                        content: c(`Location has been ${props.locationId ? "updated" : "created"} successfully`),
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
                content: "Are you sure you want to delete this Location?",
                autoCloseModal: false,
                onOk: () => {
                    toggleActionModalLoading(true);
                    deleteLocation(id, {
                        onSuccess: () => {
                            closeActionModal();
                            showModal({
                                type: "success",
                                content: c("Location has been deleted successfully"),
                                onClose: () => {
                                    methods.reset();
                                    router.push(router.paths.get("locations"), { force: true });
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
        [deleteLocation, showModal, showActionModal, toggleActionModalLoading, closeActionModal]
    );

    return (
        <>
            <SectionWrapper
                loading={isLoading}
                sectionLabel={`${props.locationId ? "Update" : "Create"} Location`}
                width="100%">
                <FormWrapper methods={methods} fields={fields}>
                    <Form
                        onReset={() => {
                            methods.reset();
                        }}
                        onFinish={methods.handleSubmit(onSubmit)}>
                        <LocationForm
                            editMode={!!props.locationId}
                            locationId={props.locationId}
                            onClickDelete={() => {
                                props.locationId && onDelete(props.locationId);
                            }}
                            disableSubmit={!methods.formState.isValid}
                        />
                    </Form>
                </FormWrapper>
            </SectionWrapper>
        </>
    );
}
