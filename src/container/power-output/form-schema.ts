import { ChargingSpeedEnum } from "@/constant/enum/PowerOutput";
import { PowerOutputPayload } from "@/interfaces/power-output";
import { object, ObjectSchema, string, number } from "yup";

export const PowerOutputFormSchema: ObjectSchema<PowerOutputPayload> = object().shape({
    output_value: number()
        .required()
        .typeError("Output Value must be a number")
        .positive()
        .integer()
        .when(["charging_speed"], ([charging_speed], schema) => {
            switch (charging_speed) {
                case ChargingSpeedEnum.SLOW.value:
                    return schema.min(2).max(7);
                case ChargingSpeedEnum.FAST.value:
                    return schema.min(7).max(150);
                case ChargingSpeedEnum.ULTRA_FAST.value:
                    return schema.min(150);
                default:
                    return schema.min(0);
            }
        })
        .label("Output Value"),
    charging_speed: string().required().label("Charging Speed"),
    voltage: number()
        .required()
        .typeError("Voltage must be a number")
        .positive()
        .integer()
        .when(["charging_speed"], ([charging_speed], schema) => {
            switch (charging_speed) {
                case ChargingSpeedEnum.SLOW.value:
                    return schema.min(100).max(220);
                case ChargingSpeedEnum.FAST.value:
                    return schema.min(220).max(380);
                case ChargingSpeedEnum.ULTRA_FAST.value:
                    return schema.min(380);
                default:
                    return schema.min(0);
            }
        })
        .label("Voltage"),
    description: string().nullable().max(1000).default(null).label("Description")
});
