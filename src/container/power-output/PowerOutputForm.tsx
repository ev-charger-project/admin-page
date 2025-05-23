import { GridLayout } from "@/components/GridLayout/GridLayout";
import React from "react";
import useGetPowerOutputComponent, { UseGetPowerOutputComponentProps } from "./useGetPowerOutputComponent";

export default function PowerOutputForm(props: UseGetPowerOutputComponentProps): React.JSX.Element {
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
                                    xl: 6
                                },
                                gutter: [40, 40],
                                component: components.OutputValue
                            },
                            {
                                screenBreakpoints: {
                                    xl: 6
                                },
                                component: components.ChargingSpeed
                            },
                            {
                                screenBreakpoints: {
                                    xl: 6
                                },
                                component: components.Voltage
                            }
                        ]
                    },
                    {
                        screenBreakpoints: {
                            xl: 24
                        },
                        component: components.Description
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
