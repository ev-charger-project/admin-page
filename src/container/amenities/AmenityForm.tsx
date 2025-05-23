import React from "react";
import { GridLayout } from "@/components/GridLayout/GridLayout";
import useGetLocationComponent, { AmenityComponentProps } from "./useGetAmenityComponent";

export default function AmenityForm({
    editMode = false,
    onClickDelete = () => {},
    disableSubmit = false
}: AmenityComponentProps): React.JSX.Element {
    const components = useGetLocationComponent({ editMode, onClickDelete, disableSubmit });

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
                                component: components.AmenityTypeName,
                                screenBreakpoints: {
                                    xl: 8
                                }
                            },
                            {
                                component: components.AmenityImage,
                                screenBreakpoints: {
                                    xl: 8
                                }
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
                                gridItems: [components.ResetButton, components.DeleteButton]
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
