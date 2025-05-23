import { ChargingSpeedEnum } from "@/constant/enum/PowerOutput";
import { FieldsData } from "@/interfaces/form";
import { PowerOutputPayload } from "@/interfaces/power-output";
import { enumToSelectOptions } from "@/utils/enum";
import { useMemo } from "react";
import { MAX_INT32 } from "@/constant";
import { UseFormReturn } from "react-hook-form";

export default function useGeneratePowerOutputFields(
    methods: UseFormReturn<PowerOutputPayload, any, undefined>
): FieldsData<PowerOutputPayload> {
    return useMemo<FieldsData<PowerOutputPayload>>(
        () => ({
            output_value: {
                label: "Output Value (kW)",
                type: "text",
                componentProps: {
                    type: "number",
                    isRequired: true,
                    max: MAX_INT32,
                    min: 0,
                    placeholder: "Type here"
                }
            },
            charging_speed: {
                label: "Charging Speed",
                type: "select",
                options: enumToSelectOptions(ChargingSpeedEnum),
                componentProps: {
                    isRequired: true,
                    placeholder: "Select Charging Speed",
                    onSelect: () => {
                        methods.trigger("output_value");
                        methods.trigger("voltage");
                    },
                    style: {
                        height: "40px"
                    }
                }
            },
            voltage: {
                label: "Voltage (V)",
                type: "text",
                componentProps: {
                    isRequired: true,
                    type: "number",
                    max: MAX_INT32,
                    min: 0,
                    placeholder: "Type here"
                }
            },
            description: {
                label: "Description",
                type: "textarea",
                componentProps: {
                    placeholder: "Type here",
                    style: {
                        width: "400px",
                        height: "200px"
                    }
                }
            }
        }),
        [methods]
    );
}
