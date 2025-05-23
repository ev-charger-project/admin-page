import { boolean, object, ObjectSchema, string } from "yup";
import { EvUserPayload } from "@/interfaces/ev-user";

export const EvUserFormSchema: ObjectSchema<EvUserPayload> = object().shape({
    email: string().email().required().label("Email"),
    password: string().required().label("Password"),
    name: string().required().label("Name"),
    phone_number: string().nullable().default(null).label("Phone Number"),
    is_active: boolean().required().default(false).valueToBoolean().label("Is Active"),
    is_superuser: boolean().required().default(false).valueToBoolean().label("Is Admin"),
    image_url: string().nullable().default(null).label("Image")
});
