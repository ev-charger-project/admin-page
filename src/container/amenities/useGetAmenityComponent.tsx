import React from "react";
import { ComponentRenderer } from "@/interfaces/Gridlayout.type";
import { useFormWrapperCtx } from "@/components/form/FormWrapper";
import { CreateAmenityPayload } from "@/interfaces/amenity";
import SharedButton from "@/components/button/SharedButton";
import { c } from "@/utils/string";
import { useRouter } from "@/hook/router";
import Link from "next/link";

interface UseGetAmenityComponent {
    AmenityTypeName: ComponentRenderer;
    AmenityImage: ComponentRenderer;
    CancelButton: ComponentRenderer;
    SaveButton: ComponentRenderer;
    ResetButton: ComponentRenderer;
    DeleteButton: ComponentRenderer;
}

export interface AmenityComponentProps {
    editMode?: boolean;
    onClickDelete: () => void;
    disableSubmit?: boolean;
}

export default function useGetAmenityComponent({
    editMode = false,
    onClickDelete,
    disableSubmit = false
}: AmenityComponentProps): UseGetAmenityComponent {
    const router = useRouter();
    const { FormField } = useFormWrapperCtx<CreateAmenityPayload>();

    return {
        AmenityTypeName: () => <FormField name="amenities_types" />,
        AmenityImage: () => <FormField name="image_url" />,
        CancelButton: () => (
            <Link
                href={router.paths.get("amenities")}
                style={{
                    marginBottom: 50
                }}>
                <SharedButton title={c("Cancel")} customType="secondary" customSize="sm" />
            </Link>
        ),
        SaveButton: () => (
            <SharedButton
                customDisabled={disableSubmit}
                title={c("Save")}
                htmlType={"submit"}
                customType="action"
                customSize="sm"
            />
        ),
        ResetButton: () => <SharedButton title={c("Reset")} customType="secondary" customSize="sm" htmlType="reset" />,
        DeleteButton: () =>
            editMode ? (
                <SharedButton title={c("Delete")} customType="danger" customSize="sm" onClick={onClickDelete} />
            ) : undefined
    };
}
