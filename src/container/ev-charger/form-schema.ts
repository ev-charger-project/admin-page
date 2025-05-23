import { CreateEVChargerPayload, EVChargerPortPayload } from "@/interfaces/ev-charger";
import { array, object, ObjectSchema, string } from "yup";

export const EVChargerFormSchema: ObjectSchema<CreateEVChargerPayload> = object().shape({
    availability: string().required().label("Availability").default("available"),
    station_name: string().required().label("Station Name"),
    location_id: string().required().label("Location ID"),
    installation_date: string().nullable().default(null).label("Installation Date"),
    last_maintenance_date: string()
        .nullable()
        .default(null)
        .label("Last Maintenance Date")
        .test("isLarger", "Last Maintenance must be later than installation date", (value, testContext) => {
            if (
                testContext.parent.installation_date !== null &&
                testContext.parent.installation_date !== "" &&
                value !== null &&
                value !== ""
            ) {
                console.log(testContext.parent.installation_date);
                if (testContext.parent.installation_date > value) return false;
                return true;
            }
            return true;
        }),
    ev_charger_ports: array<EVChargerPortPayload>(
        object<EVChargerPortPayload>().shape({
            power_output_id: string().required().label("Power Output").default(null),
            power_plug_type_id: string().required().label("Power Plug Type").default(null)
        })
    )
        .default([])
        .required()
        .min(1)
});
