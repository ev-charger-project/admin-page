import { GridLayout } from "@/components/GridLayout/GridLayout";
import React from "react";
import useGetPowerOutputComponent, { UseGetEvUserComponentProps } from "./useGetEvUserComponent";

export default function EvUserForm(props: UseGetEvUserComponentProps): React.JSX.Element {
    const components = useGetPowerOutputComponent(props);

    return (
        <GridLayout
            schema={{
                screenBreakpoints: {
                    xl: 24
                },
                defaultItemGutter: [40, 40],
                gridItems: [
                    {
                        screenBreakpoints: {
                            xl: 24
                        },
                        gutter: [40, 40],
                        gridItems: [
                            {
                                screenBreakpoints: {
                                    xl: 8
                                },
                                gutter: [40, 40],
                                component: components.Email
                            },
                            components.Name,
                            {
                                screenBreakpoints: {
                                    xl: 6
                                },
                                component: components.Password
                            }
                        ]
                    },
                    {
                        screenBreakpoints: {
                            xl: 24
                        },
                        gutter: [40, 40],
                        gridItems: [
                            {
                                screenBreakpoints: {
                                    xl: 8
                                },
                                gutter: [40, 40],
                                component: components.Phone
                            },
                            {
                                screenBreakpoints: {
                                    xl: 6
                                },
                                component: components.IsActive
                            },
                            components.IsAdmin
                        ]
                    },
                    {
                        screenBreakpoints: {
                            xl: 24
                        },
                        gutter: [40, 40],
                        gridItems: [
                            {
                                screenBreakpoints: {
                                    xl: 6
                                },
                                gutter: [40, 40],
                                component: components.ImageButton
                            }
                        ]
                    },
                    {
                        screenBreakpoints: {
                            xl: 24
                        },
                        gutter: [40, 40],
                        gridItems: [
                            {
                                screenBreakpoints: {
                                    xl: 16
                                },
                                component: components.DeleteButton
                            },
                            components.CancelButton,
                            components.SaveButton
                        ]
                    }
                ]
            }}
        />
    );
}
