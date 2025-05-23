import { GridLayout } from "@/components/GridLayout/GridLayout";
import React from "react";
import useGetEVChargerComponent, { UseGetEVChargerComponentProps } from "./useGetEVChargerComponent";

export default function EVChargerForm(props: UseGetEVChargerComponentProps): React.JSX.Element {
    const components = useGetEVChargerComponent(props);

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
                                    xl: 6
                                },
                                gutter: [40, 40],
                                component: components.StationName
                            },
                            {
                                screenBreakpoints: {
                                    xl: 6
                                },
                                gutter: [40, 40],
                                component: components.Location
                            }
                        ]
                    },
                    {
                        screenBreakpoints: {
                            xl: 24
                        },
                        component: components.ChargerPortItems
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
                                component: components.InstallationDate
                            },
                            {
                                screenBreakpoints: {
                                    xl: 6
                                },
                                gutter: [40, 40],
                                component: components.LastMaintenanceDate
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
