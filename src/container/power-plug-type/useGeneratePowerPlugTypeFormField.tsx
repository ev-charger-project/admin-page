import { useMemo } from "react";
import { FieldsData } from "@/interfaces/form";
import { PowerPlugTypePayload } from "@/interfaces/power-plug-type";
import { enumToSelectOptions } from "@/utils/enum";
import { PowerModelEnum } from "@/constant/enum/PowerPlugType";

function useGeneratePowerPlugTypeFormField() {
    return useMemo<FieldsData<PowerPlugTypePayload>>(
        () => ({
            plug_type: {
                label: "Plug Type",
                type: "text",
                componentProps: {
                    type: "text",
                    isRequired: true,
                    placeholder: "Type here"
                }
            },
            power_model: {
                label: "Power Model",
                type: "select",
                options: enumToSelectOptions(PowerModelEnum),
                componentProps: {
                    isRequired: true,
                    placeholder: "Select Power Model",
                    style: {
                        height: "40px"
                    }
                }
            },
            power_plug_region: {
                label: "Use In Region",
                type: "text",
                componentProps: {
                    isRequired: true,
                    type: "text",
                    placeholder: "Type here"
                }
            },
            additional_note: {
                label: "Description",
                type: "textarea",
                componentProps: {
                    placeholder: "Type here",
                    style: {
                        height: "200px"
                    }
                }
            },
            plug_image_url: {
                label: "Plug Image",
                type: "filepicker",
                componentProps: {
                    style: {
                        width: "200px",
                        height: "200px"
                    }
                }
            }
        }),
        []
    );
}

export default useGeneratePowerPlugTypeFormField;
