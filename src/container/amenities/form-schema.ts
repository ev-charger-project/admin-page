import { object, ObjectSchema, string } from "yup";

import { CreateAmenityPayload } from "@/interfaces/amenity";
export const addEditAmenitySchema: ObjectSchema<CreateAmenityPayload> = object().shape({
    amenities_types: string().required().max(100).label("Amenity Type Name"),
    image_url: string().nullable().default(null).label("Image")
});
