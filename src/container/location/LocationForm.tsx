import React from "react";
import { GridLayout } from "@/components/GridLayout/GridLayout";
import useGetLocationComponent, { LocationComponentProps } from "./useGetLocationComponent";

function LocationForm({
    editMode = false,
    locationId,
    onClickDelete = () => {},
    disableSubmit = false
}: LocationComponentProps): React.JSX.Element {
    const components = useGetLocationComponent({ editMode, locationId, onClickDelete, disableSubmit });

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
                                component: components.LocationName,
                                screenBreakpoints: {
                                    xl: 8
                                }
                            },
                            {
                                component: components.Latitude,
                                screenBreakpoints: {
                                    xl: 8
                                }
                            },
                            {
                                component: components.Longitude,
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
                                component: components.Country,
                                screenBreakpoints: {
                                    xl: 8
                                }
                            },
                            {
                                component: components.PostalCode,
                                screenBreakpoints: {
                                    xl: 8
                                }
                            },
                            {
                                component: components.PhoneNumber,
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
                                component: components.CityProvince,
                                screenBreakpoints: {
                                    xl: 8
                                }
                            },
                            {
                                component: components.Pricing,
                                screenBreakpoints: {
                                    xl: 8
                                }
                            },
                            {
                                component: components.ParkingLevel,
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
                                    xl: 8
                                },
                                gridItems: [
                                    {
                                        component: components.District,
                                        screenBreakpoints: {
                                            xl: 24
                                        }
                                    },
                                    {
                                        component: components.StreetAddress,
                                        screenBreakpoints: {
                                            xl: 24
                                        }
                                    },
                                    {
                                        screenBreakpoints: {
                                            xl: 24
                                        },
                                        gutter: [40, 40],
                                        component: components.Amenities
                                    }
                                ]
                            },
                            {
                                component: components.Description,
                                screenBreakpoints: {
                                    xl: 16
                                }
                            }
                        ]
                    },
                    {
                        screenBreakpoints: {
                            xl: 24
                        },
                        gutter: [40, 40],
                        component: components.WorkingDays
                    },
                    {
                        screenBreakpoints: {
                            xl: 24
                        },
                        component: components.LocationImage
                    },
                    {
                        screenBreakpoints: {
                            xl: 24
                        },
                        component: components.LocationHistoryList
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

export default LocationForm;
