import SharedButton from "@/components/button/SharedButton";
import { useFormWrapperCtx } from "@/components/form/FormWrapper";
import { useRouter } from "@/hook/router";
import React from "react";
import { ComponentRenderer } from "@/interfaces/Gridlayout.type";
import { c } from "@/utils/string";
import Link from "next/link";
import { CreateEVChargerPayload } from "@/interfaces/ev-charger";
import AddMultipleItems from "@/container/ev-charger/AddMultipleLineItem";

interface UseGetEVChargerComponent {
    StationName: ComponentRenderer;
    Location: ComponentRenderer;
    InstallationDate: ComponentRenderer;
    LastMaintenanceDate: ComponentRenderer;
    ChargerPortItems: ComponentRenderer;
    CancelButton: ComponentRenderer;
    SaveButton: ComponentRenderer;
    DeleteButton: ComponentRenderer;
}

export interface UseGetEVChargerComponentProps {
    EVChargerId?: string;
    onClickDelete?: () => void;
    disableSubmit?: boolean;
}

function useGetEVChargerComponent({
    EVChargerId,
    onClickDelete,
    disableSubmit = false
}: UseGetEVChargerComponentProps): UseGetEVChargerComponent {
    const router = useRouter();

    const { FormField } = useFormWrapperCtx<CreateEVChargerPayload>();

    return {
        StationName: () => <FormField name="station_name" />,
        Location: () => <FormField name="location_id" />,
        InstallationDate: () => <FormField name="installation_date" />,
        LastMaintenanceDate: () => <FormField name="last_maintenance_date" />,
        ChargerPortItems: AddMultipleItems,
        CancelButton: () => (
            <Link
                href={router.paths.get("ev-chargers")}
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
        DeleteButton: () =>
            EVChargerId ? (
                <SharedButton title={c("Delete")} customType="danger" customSize="sm" onClick={onClickDelete} />
            ) : null
    };
}

export default useGetEVChargerComponent;
