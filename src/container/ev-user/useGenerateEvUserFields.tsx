import { FieldsData } from "@/interfaces/form";
import { EvUserPayload } from "@/interfaces/ev-user";
import { useMemo } from "react";

export default function useGenerateEvUserFields() {
    return useMemo<FieldsData<EvUserPayload>>(
        () => ({
            email: {
                type: "text",
                label: "Email",
                componentProps: {
                    isRequired: true,
                    placeholder: "Type here"
                }
            },
            password: {
                type: "text",
                label: "Password",
                componentProps: {
                    isRequired: true,
                    placeholder: "Type here"
                }
            },
            name: {
                type: "text",
                label: "Name",
                componentProps: {
                    isRequired: true,
                    placeholder: "Type here"
                }
            },
            phone_number: {
                type: "text",
                label: "Phone Number",
                componentProps: {
                    placeholder: "Type here"
                }
            },
            is_active: {
                type: "switch",
                label: "Is Active",
                componentProps: {
                    isRequired: true
                }
            },
            is_superuser: {
                type: "switch",
                label: "Is Admin",
                componentProps: {
                    isRequired: true
                }
            },
            image_url: {
                type: "filepicker",
                label: "Image",
                componentProps: {
                    maxCount: 1
                }
            }
        }),
        []
    );
}
