import { ComponentRenderer } from "@/interfaces/Gridlayout.type";
import { useFormWrapperCtx } from "@/components/form/FormWrapper";
import { PowerPlugTypePayload } from "@/interfaces/power-plug-type";
import SharedButton from "@/components/button/SharedButton";
import { c } from "@/utils/string";
import { useRouter } from "@/hook/router";
import Link from "next/link";
import React from "react";

interface UseGetPowerPlugTypeComponent {
    PlugType: ComponentRenderer;
    PowerModel: ComponentRenderer;
    UseInRegion: ComponentRenderer;
    PlugImage: ComponentRenderer;
    Description: ComponentRenderer;
    CancelButton: ComponentRenderer;
    SaveButton: ComponentRenderer;
    DeleteButton: ComponentRenderer;
}

export interface PowerPlugTypeComponentProps {
    powerPlugTypeId?: string;
    onClickDelete?: () => void;
}

function useGetPowerPlugTypeComponent({
    powerPlugTypeId,
    onClickDelete
}: PowerPlugTypeComponentProps): UseGetPowerPlugTypeComponent {
    const router = useRouter();
    const { FormField } = useFormWrapperCtx<PowerPlugTypePayload>();

    return {
        PlugType: () => <FormField name="plug_type" />,
        PowerModel: () => <FormField name="power_model" />,
        UseInRegion: () => <FormField name="power_plug_region" />,
        PlugImage: () => <FormField name="plug_image_url" />,
        Description: () => <FormField name="additional_note" />,
        CancelButton: () => (
            <Link
                href={router.paths.get("power-plug-types")}
                style={{
                    marginBottom: 50
                }}>
                <SharedButton title={c("Cancel")} customType="secondary" customSize="sm" />
            </Link>
        ),
        SaveButton: () => <SharedButton title={c("Save")} htmlType={"submit"} customType="action" customSize="sm" />,
        DeleteButton: () =>
            powerPlugTypeId ? (
                <SharedButton title={c("Delete")} customType="danger" customSize="sm" onClick={onClickDelete} />
            ) : null
    };
}

export default useGetPowerPlugTypeComponent;
