import { GridLayout } from "@/components/GridLayout/GridLayout";
import useGetPowerPlugTypeComponent, {
    PowerPlugTypeComponentProps
} from "@/container/power-plug-type/useGetPowerPlugTypeComponent";
import React from "react";

function PowerPlugTypeForm({ powerPlugTypeId, onClickDelete }: PowerPlugTypeComponentProps): React.JSX.Element {
    const components = useGetPowerPlugTypeComponent({ powerPlugTypeId, onClickDelete });
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
                        gridItems: [components.PlugType, components.PowerModel, components.UseInRegion]
                    },
                    {
                        screenBreakpoints: {
                            xl: 24
                        },
                        gridItems: [
                            {
                                screenBreakpoints: {
                                    xl: 8
                                },
                                component: components.PlugImage
                            }
                        ]
                    },
                    {
                        screenBreakpoints: {
                            xl: 12
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

export default PowerPlugTypeForm;
