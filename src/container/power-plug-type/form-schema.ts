import { object, ObjectSchema, string } from "yup";
import { PowerPlugTypePayload } from "@/interfaces/power-plug-type";

export const PowerPlugTypeFormSchema: ObjectSchema<PowerPlugTypePayload> = object().shape({
    power_plug_region: string().required().label("Use In Region"),
    plug_image_url: string().nullable().default(null).label("Plug Image"),
    power_model: string().required().label("Power Model"),
    additional_note: string().nullable().default(null).label("Description"),
    plug_type: string().required().label("Plug Type")
});
