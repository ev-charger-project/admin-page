import { useMemo } from "react";

import { FieldsData } from "@/interfaces/form";
import { CreateAmenityPayload } from "@/interfaces/amenity";
import { c } from "@/utils/string";

export const useGenerateFields = (): FieldsData<CreateAmenityPayload> => {
    return useMemo<FieldsData<CreateAmenityPayload>>(
        () => ({
            amenities_types: {
                label: c("Amenity Type Name"),
                type: "text",
                componentProps: {
                    isRequired: true
                }
            },
            image_url: {
                label: c("Amenity image"),
                type: "filepicker",
                componentProps: {
                    style: {
                        width: "300px",
                        height: "200px"
                    }
                }
            }
        }),
        []
    );
};

export default useGenerateFields;
