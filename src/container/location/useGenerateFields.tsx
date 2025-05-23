import React, { useMemo } from "react";

import { ISelectOptions } from "@/constant/select";
import { FieldsData } from "@/interfaces/form";
import { CreateLocationPayload, CityModel, DistrictModel } from "@/interfaces/location";
import { c } from "@/utils/string";
import { countries } from "@/constant/country";
import OptionLoading from "@/components/form/OptionLoading";
import { useGetListCityInfinite, useGetListDistrictInfinite } from "@/hook/location-hook";
import { useGetListAmenityInfinite } from "@/hook/amenity-hook";
import { UseFormReturn } from "react-hook-form";
import { Spin, Image } from "antd";
import { AmenityModel } from "@/interfaces/amenity";
import DropdownHeader from "@/components/DropdownHeader";
import DropdownRow from "@/components/DropdownRow";

export const useGenerateFields = (
    methods: UseFormReturn<CreateLocationPayload, any, undefined>
): FieldsData<CreateLocationPayload> => {
    const countrySelectOptions = useMemo(() => {
        return countries.map<ISelectOptions<string>>(({ label, value }) => ({
            label,
            value
        }));
    }, []);

    const {
        data: amenityList,
        isLoading: isInitialFetchingAmenitiesList,
        fetchNextPage: fetchMoreAmenitiesList,
        isFetchingNextPage: isFetchingMoreAmenitiesList,
        setSearchTerm: searchAmenities
    } = useGetListAmenityInfinite({
        order_by: "amenities_types",
        ordering: "asc",
        page_size: 10
    });

    const {
        data: cityList,
        isLoading: isInitialFetchingCityList,
        fetchNextPage: fetchMoreCityList,
        isFetchingNextPage: isFetchingMoreCityList,
        setSearchTerm: searchCity
    } = useGetListCityInfinite({
        country: methods.getValues()["country"],
        order_by: "name",
        ordering: "asc",
        page_size: 10
    });

    const {
        data: districtList,
        isLoading: isInitialFetchingDistrictList,
        fetchNextPage: fetchMoreDistrictList,
        isFetchingNextPage: isFetchingMoreDistrictList,
        setSearchTerm: searchDistrict
    } = useGetListDistrictInfinite({
        city: methods.getValues()["city"],
        order_by: "name",
        ordering: "asc",
        page_size: 10
    });

    const amenitiesSelectOptions = useMemo(() => {
        return (
            amenityList?.pages?.map<ISelectOptions<string, AmenityModel>>((amenity) => ({
                label: `${amenity.amenities_types}`,
                value: `${amenity.id}`,
                extraData: amenity
            })) || []
        );
    }, [amenityList]);

    const citySelectOptions = useMemo(() => {
        return (
            cityList?.pages?.map<ISelectOptions<string, CityModel>>((city) => ({
                label: `${city.name}`,
                value: city.name,
                extraData: city
            })) || []
        );
    }, [cityList]);

    const districtSelectOptions = useMemo(() => {
        return (
            districtList?.pages?.map<ISelectOptions<string, DistrictModel>>((district) => ({
                label: `${district.name}`,
                value: district.name,
                extraData: district
            })) || []
        );
    }, [districtList]);

    return useMemo<FieldsData<CreateLocationPayload>>(
        () => ({
            location_name: {
                label: c("Location Name"),
                type: "text",
                componentProps: {
                    isRequired: true
                }
            },
            street: {
                label: c("Street"),
                type: "textarea",
                componentProps: {
                    isRequired: true,
                    style: {
                        height: "120px"
                    }
                }
            },
            district: {
                label: c("District"),
                type: "select",
                options: districtSelectOptions,
                componentProps: {
                    placeholder: "Select a District...",
                    isRequired: false,
                    showSearch: true,
                    filterOption: false,
                    allowClear: true,
                    loading: isInitialFetchingDistrictList,
                    style: {
                        height: "40px"
                    },
                    onSearch: (searchTerm) => {
                        searchDistrict(searchTerm);
                    },
                    dropdownRender: (menu) =>
                        isInitialFetchingCityList ? (
                            <OptionLoading />
                        ) : (
                            <Spin spinning={isFetchingMoreCityList}>{menu}</Spin>
                        ),
                    onPopupScroll: (e) => {
                        const scrollTop = (e.target as HTMLDivElement).scrollTop;
                        const scrollHeight = (e.target as HTMLDivElement).scrollHeight;
                        const elHeight = (e.target as HTMLDivElement).clientHeight;
                        if (elHeight + scrollTop >= scrollHeight - 100 && !isFetchingMoreDistrictList) {
                            fetchMoreDistrictList().then(() => {});
                        }
                    }
                },
                loading: isInitialFetchingDistrictList
            },
            city: {
                label: c("City"),
                type: "select",
                options: citySelectOptions,
                componentProps: {
                    placeholder: "Select a City...",
                    showSearch: true,
                    filterOption: false,
                    isRequired: true,
                    loading: isInitialFetchingCityList,
                    style: {
                        height: "40px"
                    },
                    onSearch: (searchTerm) => {
                        searchCity(searchTerm);
                    },
                    dropdownRender: (menu) =>
                        isInitialFetchingCityList ? (
                            <OptionLoading />
                        ) : (
                            <Spin spinning={isFetchingMoreCityList}>{menu}</Spin>
                        ),
                    onSelect: () => {
                        methods.trigger("district");
                        methods.setValue("district", "");
                    },
                    onPopupScroll: (e) => {
                        const scrollTop = (e.target as HTMLDivElement).scrollTop;
                        const scrollHeight = (e.target as HTMLDivElement).scrollHeight;
                        const elHeight = (e.target as HTMLDivElement).clientHeight;
                        if (elHeight + scrollTop >= scrollHeight - 100 && !isFetchingMoreCityList) {
                            fetchMoreCityList().then(() => {});
                        }
                    }
                }
            },
            country: {
                label: c("Country"),
                type: "select",
                options: countrySelectOptions,
                componentProps: {
                    placeholder: "Select a Country...",
                    showSearch: true,
                    isRequired: true,
                    style: {
                        height: "40px"
                    },
                    onSelect: () => {
                        methods.trigger("city");
                        methods.setValue("city", "");
                        methods.setValue("district", "");
                    }
                }
            },
            postal_code: {
                label: c("Postal Code"),
                type: "text"
            },
            latitude: {
                label: c("Latitude"),
                type: "text",
                componentProps: {
                    isRequired: true
                }
            },
            longitude: {
                label: c("Longitude"),
                type: "text",
                componentProps: {
                    isRequired: true
                }
            },
            description: {
                label: c("Description"),
                type: "textarea",
                componentProps: {
                    style: {
                        height: "200px"
                    }
                }
            },
            image_url: {
                label: c("Location image"),
                type: "filepicker",
                componentProps: {
                    style: {
                        width: "300px",
                        height: "200px"
                    }
                }
            },
            pricing: {
                label: c("Pricing"),
                type: "text"
            },
            phone_number: {
                label: c("Phone Number"),
                type: "phoneNumber"
            },
            parking_level: {
                label: c("Parking Level"),
                type: "text"
            },
            working_days: {
                label: null,
                type: "text",
                componentProps: {
                    style: {
                        height: 0,
                        display: "none"
                    }
                }
            },
            "amenities_id.[]": {
                label: c("Amenities"),
                type: "select",
                options: amenitiesSelectOptions,
                componentProps: {
                    mode: "multiple",
                    placeholder: "Select Amenities...",
                    showSearch: true,
                    filterOption: false,
                    loading: isInitialFetchingAmenitiesList,
                    maxTagCount: "responsive",
                    dropdownStyle: { width: "144px" },
                    style: {
                        height: "40px"
                    },
                    onSearch: (searchTerm) => {
                        searchAmenities(searchTerm);
                    },
                    dropdownRender: (menu) =>
                        isInitialFetchingAmenitiesList ? (
                            <OptionLoading />
                        ) : (
                            <Spin spinning={isFetchingMoreAmenitiesList}>
                                <DropdownHeader
                                    config={[
                                        {
                                            label: c("Label"),
                                            span: 9
                                        },
                                        {
                                            label: c("Image"),
                                            span: 3
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
                                        span: 9
                                    },
                                    {
                                        render() {
                                            return (
                                                <div
                                                    style={{
                                                        padding: "4px 4px"
                                                    }}>
                                                    {option.extraData.image_url && (
                                                        <Image
                                                            src={`${process.env.NEXT_PUBLIC_EV_CHARGER_SERVICE_BASE_URL}/api/v1/media/${option.extraData.image_url}`}
                                                            alt="Plug Image"
                                                        />
                                                    )}
                                                </div>
                                            );
                                        },
                                        span: 3
                                    }
                                ]}
                            />
                        );
                    },
                    onPopupScroll: (e) => {
                        const scrollTop = (e.target as HTMLDivElement).scrollTop;
                        const scrollHeight = (e.target as HTMLDivElement).scrollHeight;
                        const elHeight = (e.target as HTMLDivElement).clientHeight;
                        if (elHeight + scrollTop >= scrollHeight - 100 && !isFetchingMoreAmenitiesList) {
                            fetchMoreAmenitiesList().then(() => {});
                        }
                    }
                }
            },
            "working_days.[].open_time": {
                label: c("Open Time"),
                type: "timepicker",
                componentProps: {
                    use12Hours: true,
                    format: "h:mm A",
                    style: {
                        height: "40px"
                    },
                    onChange: () => {
                        methods.trigger("working_days");
                    }
                }
            },
            "working_days.[].close_time": {
                label: c("Close Time"),
                type: "timepicker",
                componentProps: {
                    use12Hours: true,
                    format: "h:mm A",
                    style: {
                        height: "40px"
                    },
                    onChange: () => {
                        methods.trigger("working_days");
                    }
                }
            }
        }),
        [
            methods,
            isInitialFetchingCityList,
            fetchMoreCityList,
            isFetchingMoreCityList,
            citySelectOptions,
            isInitialFetchingDistrictList,
            fetchMoreDistrictList,
            isFetchingMoreDistrictList,
            districtSelectOptions,
            amenitiesSelectOptions,
            isInitialFetchingAmenitiesList,
            fetchMoreAmenitiesList,
            isFetchingMoreAmenitiesList
        ]
    );
};

export default useGenerateFields;
