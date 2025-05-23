import { RouteConfig, RouteConfigItem } from "@/interfaces/route";
import { c } from "@/utils/string";

export type NameInto<T extends readonly RouteConfigItem[]> = T extends readonly [
    infer X extends RouteConfigItem,
    ...infer Y extends RouteConfigItem[]
]
    ? X["name"] | NameInto<Y> | (X["children"] extends readonly RouteConfigItem[] ? NameInto<X["children"]> : never)
    : never;

export const routesConfig = [
    {
        path: "/",
        roles: ["*"],
        type: "unauthenticated",
        breadcrumb: c(""),
        name: "home"
    },
    {
        name: "auth",
        path: "/auth",
        roles: ["*"],
        type: "unauthenticated",
        breadcrumb: c(""),
        children: [
            {
                name: "sign-in",
                path: "/sign-in",
                roles: ["*"],
                type: "unauthenticated",
                breadcrumb: c("Sign In")
            },
            {
                name: "sign-up",
                path: "/sign-up",
                roles: ["*"],
                type: "unauthenticated",
                breadcrumb: c("Sign Up")
            }
        ]
    },
    {
        name: "dashboard",
        path: "/dashboard",
        roles: ["admin"],
        type: "authenticated",
        breadcrumb: c("Dashboard"),
        children: [
            {
                name: "power-plug-types",
                path: "/power-plug-types",
                roles: ["admin"],
                breadcrumb: c("Power Plug Types"),
                children: [
                    {
                        name: "add-power-plug-type",
                        path: "/add",
                        roles: ["admin"],
                        breadcrumb: c("Add Power Plug Type")
                    },
                    {
                        name: "edit-power-plug-type",
                        path: "/edit/{id}",
                        roles: ["admin"],
                        breadcrumb: c("Edit Power Plug Type")
                    }
                ]
            },
            {
                name: "power-outputs",
                path: "/power-outputs",
                roles: ["admin"],
                breadcrumb: c("Power Outputs"),
                children: [
                    {
                        name: "add-power-output",
                        path: "/add",
                        roles: ["admin"],
                        breadcrumb: c("Add Power Output")
                    },
                    {
                        name: "edit-power-output",
                        path: "/edit/{id}",
                        roles: ["admin"],
                        breadcrumb: c("Edit Power Output")
                    }
                ]
            },
            {
                name: "ev-chargers",
                path: "/ev-chargers",
                roles: ["*"],
                breadcrumb: c("EV Charger"),
                children: [
                    {
                        name: "add-ev-charger",
                        path: "/add",
                        roles: ["*"],
                        breadcrumb: c("Add EV Charger")
                    },
                    {
                        name: "edit-ev-charger",
                        path: "/edit/{id}",
                        roles: ["*"],
                        breadcrumb: c("Edit EV Charger")
                    }
                ]
            },
            {
                name: "locations",
                path: "/locations",
                roles: ["admin"],
                type: "public",
                breadcrumb: "Locations",
                children: [
                    {
                        name: "add-location",
                        path: "/add",
                        roles: ["*"],
                        breadcrumb: c("Add Location")
                    },
                    {
                        name: "edit-location",
                        path: "/edit/{id}",
                        roles: ["*"],
                        breadcrumb: c("Edit Location")
                    }
                ]
            },
            {
                name: "users",
                path: "/ev-user",
                roles: ["*"],
                breadcrumb: c("User"),
                children: [
                    {
                        name: "add-user",
                        path: "/add",
                        roles: ["*"],
                        breadcrumb: c("Add User")
                    },
                    {
                        name: "edit-user",
                        path: "/edit/{id}",
                        roles: ["*"],
                        breadcrumb: c("Edit User")
                    }
                ]
            },
            {
                name: "amenities",
                path: "/amenities",
                roles: ["admin"],
                type: "public",
                breadcrumb: "Amenities",
                children: [
                    {
                        name: "add-amenities",
                        path: "/add",
                        roles: ["*"],
                        breadcrumb: c("Add Amenities")
                    },
                    {
                        name: "edit-amenities",
                        path: "/edit/{id}",
                        roles: ["*"],
                        breadcrumb: c("Edit Amenities")
                    }
                ]
            }
        ]
    }
] as const satisfies RouteConfig;
