import React from "react";
import { ComponentRenderer } from "@/interfaces/Gridlayout.type";
import { useFormWrapperCtx } from "@/components/form/FormWrapper";
import { CreateLocationPayload } from "@/interfaces/location";
import SharedButton from "@/components/button/SharedButton";
import { c } from "@/utils/string";
import { useRouter } from "@/hook/router";
import Link from "next/link";
import AddMultipleItems from "./AddMultipleWorkingDayItem";
import LocationHistoryList from "./LocationHistoryList";

interface UseGetLocationComponent {
    LocationName: ComponentRenderer;
    PostalCode: ComponentRenderer;
    Latitude: ComponentRenderer;
    Longitude: ComponentRenderer;
    Country: ComponentRenderer;
    WorkingDays: ComponentRenderer;
    Amenities: ComponentRenderer;
    LocationHistoryList: ComponentRenderer;
    PhoneNumber: ComponentRenderer;
    CityProvince: ComponentRenderer;
    Pricing: ComponentRenderer;
    ParkingLevel: ComponentRenderer;
    District: ComponentRenderer;
    Description: ComponentRenderer;
    StreetAddress: ComponentRenderer;
    LocationImage: ComponentRenderer;
    CancelButton: ComponentRenderer;
    SaveButton: ComponentRenderer;
    DeleteButton: ComponentRenderer;
    ResetButton: ComponentRenderer;
}

export interface LocationComponentProps {
    editMode?: boolean;
    locationId?: string;
    onClickDelete: () => void;
    disableSubmit?: boolean;
}

function useGetLocationComponent({
    editMode = false,
    locationId,
    onClickDelete,
    disableSubmit = false
}: LocationComponentProps): UseGetLocationComponent {
    const router = useRouter();
    const { FormField } = useFormWrapperCtx<CreateLocationPayload>();

    return {
        LocationName: () => <FormField name="location_name" />,
        Latitude: () => <FormField name="latitude" />,
        Longitude: () => <FormField name="longitude" />,
        PostalCode: () => <FormField name="postal_code" />,
        Country: () => <FormField name="country" />,
        PhoneNumber: () => <FormField name="phone_number" />,
        CityProvince: () => <FormField name="city" />,
        Pricing: () => <FormField name="pricing" />,
        ParkingLevel: () => <FormField name="parking_level" />,
        District: () => <FormField name="district" />,
        Description: () => <FormField name="description" />,
        StreetAddress: () => <FormField name="street" />,
        LocationImage: () => <FormField name="image_url" />,
        WorkingDays: AddMultipleItems,
        Amenities: () => <FormField name="amenities_id.[]" />,
        LocationHistoryList: () => (editMode ? LocationHistoryList(locationId) : null),
        CancelButton: () => (
            <Link
                href={router.paths.get("locations")}
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

export default useGetLocationComponent;
