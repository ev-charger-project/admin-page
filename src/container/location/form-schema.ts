import { array, number, object, ObjectSchema, string } from "yup";

import { CreateLocationPayload } from "@/interfaces/location";
import { WorkingDayPayload } from "@/interfaces/working_day";

export const addEditLocationSchema: ObjectSchema<CreateLocationPayload> = object().shape({
    location_name: string().required().max(100).label("Location Name"),
    street: string().required().max(255).label("Street"),
    district: string().nullable().default(null).max(100).label("District"),
    city: string().required().max(100).label("City"),
    country: string().required().max(100).label("Country"),
    postal_code: string().nullable().max(20).default(null).label("Postal Code"),
    latitude: number().required().min(-90).max(90).label("Latitude"),
    longitude: number().required().min(-180).max(180).label("Longitude"),
    description: string().nullable().max(1000).default(null).label("Description"),
    image_url: string().nullable().default(null).label("Image"),
    pricing: string().nullable().max(100).default(null).label("Pricing"),
    phone_number: string()
        .nullable()
        .default(null)
        .label("Phone Number")
        .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/, {
            message: "Phone number should be +(xx)xxxxxxxxx",
            excludeEmptyString: true
        }),
    parking_level: string().nullable().max(50).default(null).label("Parking Level"),
    amenities_id: array().nullable().default([]),
    working_days: array<WorkingDayPayload>()
        .of(
            object<WorkingDayPayload>().shape(
                {
                    day: number().required().min(1).max(7).label("Day"),
                    open_time: string()
                        .required("Open Time must be filled")
                        .when("close_time", {
                            is: "",
                            then: (schema) => schema.notRequired(),
                            otherwise: (schema) => schema.required("Open Time must be filled")
                        })
                        .test("isSmaller", "Open Time must be earlier Close Time", (value, testContext) => {
                            if (testContext.parent.close_time !== "") {
                                if (testContext.parent.close_time <= value) return false;
                            }
                            return true;
                        })
                        .label("Open Time"),
                    close_time: string()
                        .required("Close Time must be filled")
                        .when("open_time", {
                            is: "",
                            then: (schema) => schema.notRequired(),
                            otherwise: (schema) => schema.required("Close Time must be filled")
                        })
                        .test("isLarger", "Close Time must be later Open Time", (value, testContext) => {
                            if (testContext.parent.open_time !== "") {
                                if (testContext.parent.open_time >= value) return false;
                            }
                            return true;
                        })
                        .label("Close Time")
                },
                [["open_time", "close_time"]]
            )
        )
        .min(1)
        .max(7)
        .required()
        .test("isEmpty", "At least one working day must be entered", (value) => {
            for (let i = 0; i < 7; i++) {
                if (value[i].open_time !== "" || value[i].close_time !== "") return true;
            }
            return false;
        })
});
