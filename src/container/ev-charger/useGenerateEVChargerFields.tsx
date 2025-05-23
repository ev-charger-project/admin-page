import { CreateEVChargerPayload } from "@/interfaces/ev-charger";
import { FieldsData } from "@/interfaces/form";
import React, { useMemo } from "react";
import { c } from "@/utils/string";
import { Spin } from "antd";
import DropdownHeader from "@/components/DropdownHeader";
import OptionLoading from "@/components/form/OptionLoading";
import DropdownRow from "@/components/DropdownRow";
import { useGetListLocationInfinite } from "@/hook/location-hook";
import { ISelectOptions } from "@/constant/select";
import { LocationModel } from "@/interfaces/location";
import { useGetListPowerOutputInfinite } from "@/hook/power-output-hook";
import { PowerOutputModel } from "@/interfaces/power-output";
import { useGetListPowerPlugTypeInfinite } from "@/hook/power-plug-type-hook";
import { PowerPlugTypeModel } from "@/interfaces/power-plug-type";
import { UseFormReturn } from "react-hook-form";

export default function useGenerateEVChargerFields(
    methods: UseFormReturn<CreateEVChargerPayload, any, undefined>
): FieldsData<CreateEVChargerPayload> {
    const {
        data: locations,
        isLoading: isInitialFetchingLocation,
        fetchNextPage: fetchMoreLocation,
        isFetchingNextPage: isFetchingMoreLocation,
        setSearchTerm: searchLocation
    } = useGetListLocationInfinite({
        order_by: "updated_at",
        ordering: "desc",
        page_size: 10
    });

    const {
        data: powerOutputs,
        isLoading: isInitialFetchingPowerOutput,
        fetchNextPage: fetchMorePowerOutput,
        isFetchingNextPage: isFetchingMorePowerOutput
    } = useGetListPowerOutputInfinite({
        order_by: "updated_at",
        ordering: "desc",
        page_size: 10
    });

    const powerOutputOptions = useMemo(() => {
        return (
            powerOutputs?.pages?.map<ISelectOptions<string, PowerOutputModel>>((po) => ({
                label: `${po.output_value}`,
                value: po.id,
                extraData: po
            })) || []
        );
    }, [powerOutputs]);

    const {
        data: powerPlugTypes,
        isLoading: isInitialFetchingPowerPlugType,
        fetchNextPage: fetchMorePowerPlugType,
        isFetchingNextPage: isFetchingMorePowerPlugType
    } = useGetListPowerPlugTypeInfinite({
        order_by: "updated_at",
        ordering: "desc",
        page_size: 10
    });

    const powerPlugTypeOptions = useMemo(() => {
        return (
            powerPlugTypes?.pages?.map<ISelectOptions<string, PowerPlugTypeModel>>((ppt) => ({
                label: `${ppt.plug_type}`,
                value: ppt.id,
                extraData: ppt
            })) || []
        );
    }, [powerPlugTypes]);

    const locationOptions = useMemo(() => {
        return (
            locations?.pages?.map<ISelectOptions<string, LocationModel>>((l) => ({
                label: `${l.location_name}`,
                value: l.id,
                extraData: l
            })) || []
        );
    }, [locations]);

    return useMemo<FieldsData<CreateEVChargerPayload>>(
        () => ({
            station_name: {
                label: "Station Name",
                type: "text",
                componentProps: {
                    isRequired: true,
                    placeholder: "Type here"
                }
            },
            location_id: {
                label: c("Location"),
                type: "select",
                options: locationOptions,
                componentProps: {
                    isRequired: true,
                    showSearch: true,
                    filterOption: false,
                    dropdownStyle: { width: "400px" },
                    style: {
                        height: "40px"
                    },
                    popupClassName: "location-options",
                    placeholder: c("Search and Select"),
                    dropdownRender: (menu) =>
                        isInitialFetchingLocation ? (
                            <OptionLoading />
                        ) : (
                            <Spin spinning={isFetchingMoreLocation}>
                                <DropdownHeader
                                    config={[
                                        {
                                            label: c("Location"),
                                            span: 4
                                        },
                                        {
                                            label: c("Address"),
                                            span: 6
                                        }
                                    ]}>
                                    {menu}
                                </DropdownHeader>
                            </Spin>
                        ),
                    onSearch: (searchTerm) => {
                        searchLocation(searchTerm);
                    },
                    renderOption(option) {
                        return (
                            <DropdownRow
                                config={[
                                    {
                                        render() {
                                            return (
                                                <div
                                                    style={{
                                                        padding: "4px 4px",
                                                        wordWrap: "break-word"
                                                    }}>
                                                    {option.label}
                                                </div>
                                            );
                                        },
                                        span: 4
                                    },

                                    {
                                        render() {
                                            return (
                                                <div
                                                    style={{
                                                        padding: "4px 4px"
                                                    }}>
                                                    {option.extraData.street}
                                                </div>
                                            );
                                        },
                                        span: 6
                                    }
                                ]}
                            />
                        );
                    },
                    onPopupScroll: (e) => {
                        const scrollTop = (e.target as HTMLDivElement).scrollTop;
                        const scrollHeight = (e.target as HTMLDivElement).scrollHeight;
                        const elHeight = (e.target as HTMLDivElement).clientHeight;
                        if (elHeight + scrollTop >= scrollHeight - 100 && !isFetchingMoreLocation) {
                            fetchMoreLocation().then(() => {});
                        }
                    }
                }
            },
            installation_date: {
                label: "Installation Date",
                type: "datepicker",
                componentProps: {
                    placeholder: "Select date",
                    onChange: () => {
                        methods.trigger("last_maintenance_date");
                    }
                }
            },
            last_maintenance_date: {
                label: "Last Maintenance Date",
                type: "datepicker",
                componentProps: {
                    placeholder: "Select date",
                    onChange: () => {
                        methods.trigger("installation_date");
                    }
                }
            },
            "ev_charger_ports.[].power_output_id": {
                label: null,
                type: "select",
                options: powerOutputOptions,
                componentProps: {
                    isRequired: false,
                    showSearch: false,
                    filterOption: false,
                    dropdownStyle: { width: "400px" },
                    style: {
                        height: "40px"
                    },
                    popupClassName: "power-output-options",
                    placeholder: c("Select"),
                    dropdownRender: (menu) =>
                        isInitialFetchingPowerOutput ? (
                            <OptionLoading />
                        ) : (
                            <Spin spinning={isFetchingMorePowerOutput}>
                                <DropdownHeader
                                    config={[
                                        {
                                            label: c("Output"),
                                            span: 4
                                        },
                                        {
                                            label: c("Voltage"),
                                            span: 6
                                        }
                                    ]}>
                                    {menu}
                                </DropdownHeader>
                            </Spin>
                        ),
                    renderOption(option) {
                        return (
                            <DropdownRow
                                config={[
                                    {
                                        render() {
                                            return (
                                                <div
                                                    style={{
                                                        padding: "4px 4px",
                                                        wordWrap: "break-word"
                                                    }}>
                                                    {`${option.label} kW`}
                                                </div>
                                            );
                                        },
                                        span: 4
                                    },

                                    {
                                        render() {
                                            return (
                                                <div
                                                    style={{
                                                        padding: "4px 4px"
                                                    }}>
                                                    {`${option.extraData.voltage} V`}
                                                </div>
                                            );
                                        },
                                        span: 6
                                    }
                                ]}
                            />
                        );
                    },
                    onPopupScroll: (e) => {
                        const scrollTop = (e.target as HTMLDivElement).scrollTop;
                        const scrollHeight = (e.target as HTMLDivElement).scrollHeight;
                        const elHeight = (e.target as HTMLDivElement).clientHeight;
                        if (elHeight + scrollTop >= scrollHeight - 100 && !isFetchingMorePowerOutput) {
                            fetchMorePowerOutput().then(() => {});
                        }
                    }
                }
            },
            "ev_charger_ports.[].power_plug_type_id": {
                label: null,
                type: "select",
                options: powerPlugTypeOptions,
                componentProps: {
                    isRequired: false,
                    showSearch: false,
                    filterOption: false,
                    dropdownStyle: { width: "400px" },
                    style: {
                        height: "40px"
                    },
                    popupClassName: "power-plug-type-options",
                    placeholder: c("Select"),
                    dropdownRender: (menu) =>
                        isInitialFetchingPowerPlugType ? (
                            <OptionLoading />
                        ) : (
                            <Spin spinning={isFetchingMorePowerPlugType}>
                                <DropdownHeader
                                    config={[
                                        {
                                            label: c("Plug Type"),
                                            span: 4
                                        },
                                        {
                                            label: c("Power Modal"),
                                            span: 6
                                        }
                                    ]}>
                                    {menu}
                                </DropdownHeader>
                            </Spin>
                        ),
                    renderOption(option) {
                        return (
                            <DropdownRow
                                config={[
                                    {
                                        render() {
                                            return (
                                                <div
                                                    style={{
                                                        padding: "4px 4px",
                                                        wordWrap: "break-word"
                                                    }}>
                                                    {option.label}
                                                </div>
                                            );
                                        },
                                        span: 4
                                    },

                                    {
                                        render() {
                                            return (
                                                <div
                                                    style={{
                                                        padding: "4px 4px"
                                                    }}>
                                                    {option.extraData.power_model}
                                                </div>
                                            );
                                        },
                                        span: 6
                                    }
                                ]}
                            />
                        );
                    },
                    onPopupScroll: (e) => {
                        const scrollTop = (e.target as HTMLDivElement).scrollTop;
                        const scrollHeight = (e.target as HTMLDivElement).scrollHeight;
                        const elHeight = (e.target as HTMLDivElement).clientHeight;
                        if (elHeight + scrollTop >= scrollHeight - 100 && !isFetchingMorePowerPlugType) {
                            fetchMorePowerPlugType().then(() => {});
                        }
                    }
                }
            }
        }),
        [
            locationOptions,
            isInitialFetchingLocation,
            isFetchingMoreLocation,
            searchLocation,
            fetchMoreLocation,
            powerOutputOptions,
            isInitialFetchingPowerOutput,
            isFetchingMorePowerOutput,
            fetchMorePowerOutput,
            powerPlugTypeOptions,
            isInitialFetchingPowerPlugType,
            isFetchingMorePowerPlugType,
            fetchMorePowerPlugType,
            methods
        ]
    );
}
