import SharedButton from "@/components/button/SharedButton";
import { useFormWrapperCtx } from "@/components/form/FormWrapper";
import { useRouter } from "@/hook/router";
import React from "react";
import { ComponentRenderer } from "@/interfaces/Gridlayout.type";
import { PowerOutputPayload } from "@/interfaces/power-output";
import { c } from "@/utils/string";
import Link from "next/link";

interface UseGetPowerOutputComponent {
    OutputValue: ComponentRenderer;
    ChargingSpeed: ComponentRenderer;
    Voltage: ComponentRenderer;
    Description: ComponentRenderer;
    CancelButton: ComponentRenderer;
    SaveButton: ComponentRenderer;
    DeleteButton: ComponentRenderer;
}

export interface UseGetPowerOutputComponentProps {
    powerOutputId?: string;
    onClickDelete?: () => void;
}

function useGetPowerOutputComponent({
    powerOutputId,
    onClickDelete
}: UseGetPowerOutputComponentProps): UseGetPowerOutputComponent {
    const router = useRouter();

    const { FormField } = useFormWrapperCtx<PowerOutputPayload>();

    return {
        OutputValue: () => <FormField name="output_value" />,
        ChargingSpeed: () => <FormField name="charging_speed" />,
        Voltage: () => <FormField name="voltage" />,
        Description: () => <FormField name="description" />,
        CancelButton: () => (
            <Link
                href={router.paths.get("power-outputs")}
                style={{
                    marginBottom: 50
                }}>
                <SharedButton title={c("Cancel")} customType="secondary" customSize="sm" />
            </Link>
        ),
        SaveButton: () => <SharedButton title={c("Save")} htmlType={"submit"} customType="action" customSize="sm" />,
        DeleteButton: () =>
            powerOutputId ? (
                <SharedButton title={c("Delete")} customType="danger" customSize="sm" onClick={onClickDelete} />
            ) : null
    };
}

export default useGetPowerOutputComponent;
