import {
    CreateLocationPayload,
    UpdateLocationPayload,
    GetListCityParams,
    GetListDistrictParams,
    GetListLocationParams
} from "@/interfaces/location";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createLocationApi,
    deleteLocationApi,
    getLocationApi,
    getLocationsApi,
    getCitiesApi,
    updateLocationApi,
    getDistrictsApi
} from "@/api/location";
import { LOCATION, CITY, DISTRICT } from "@/constant/query";
import { useDebounceValue } from "usehooks-ts";
import { useState } from "react";

export function useGetLocationList(params: GetListLocationParams) {
    return useQuery({
        queryKey: [LOCATION, params],
        queryFn: () => getLocationsApi(params),
        select: ({ data }) => data
    });
}

export const useGetListCityInfinite = (params: GetListCityParams) => {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounceValue(searchTerm, 300);

    const query = useInfiniteQuery({
        queryKey: [CITY, params, debouncedSearchTerm],
        queryFn: ({ pageParam }) =>
            getCitiesApi({
                ...params,
                page: pageParam ?? 1,
                name: debouncedSearchTerm[0]
            }),
        select: (data) => ({
            pages: data.pages.flatMap((p) => p.data.founds),
            pageParams: data.pageParams
        }),
        staleTime: 1000 * 5 * 60, // 5 mins
        refetchOnWindowFocus: true,
        getNextPageParam: (lastPage) => {
            const currentPage = lastPage.data.search_options?.page;
            const pageSize = lastPage.data.search_options?.page_size;
            const totalCount = lastPage.data.search_options?.total_count;
            if (currentPage && pageSize && totalCount) {
                const nextPage = currentPage + 1;
                return nextPage * pageSize < totalCount ? nextPage : undefined;
            }
        },
        initialPageParam: 1
    });

    return { ...query, setSearchTerm };
};

export const useGetListDistrictInfinite = (params: GetListDistrictParams) => {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounceValue(searchTerm, 300);

    const query = useInfiniteQuery({
        queryKey: [DISTRICT, params, debouncedSearchTerm],
        queryFn: ({ pageParam }) =>
            getDistrictsApi({
                ...params,
                page: pageParam ?? 1,
                name: debouncedSearchTerm[0]
            }),
        select: (data) => ({
            pages: data.pages.flatMap((p) => p.data.founds),
            pageParams: data.pageParams
        }),
        staleTime: 1000 * 5 * 60, // 5 mins
        refetchOnWindowFocus: true,
        getNextPageParam: (lastPage) => {
            const currentPage = lastPage.data.search_options?.page;
            const pageSize = lastPage.data.search_options?.page_size;
            const totalCount = lastPage.data.search_options?.total_count;
            if (currentPage && pageSize && totalCount) {
                const nextPage = currentPage + 1;
                return nextPage * pageSize < totalCount ? nextPage : undefined;
            }
        },
        initialPageParam: 1
    });

    return { ...query, setSearchTerm };
};

export function useGetLocation(id?: string) {
    return useQuery({
        queryKey: [LOCATION, id],
        queryFn: () => {
            if (!id) return Promise.reject("Id is required");
            return getLocationApi(id);
        },
        select: ({ data }) => data
    });
}

export function useCreateLocation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateLocationPayload) => createLocationApi(data),
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    predicate: (query) => query.queryKey[0] === LOCATION
                })
                .then(() => {});
        }
    });
}

export function useUpdateLocation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateLocationPayload) => updateLocationApi(data),
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    predicate: (query) => query.queryKey[0] === LOCATION
                })
                .then(() => {});
        }
    });
}

export function useDeleteLocation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteLocationApi(id),
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    predicate: (query) => query.queryKey[0] === LOCATION
                })
                .then(() => {});
        }
    });
}

export const useGetListLocationInfinite = (params: GetListLocationParams) => {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounceValue(searchTerm, 300);

    const query = useInfiniteQuery({
        queryKey: [LOCATION, params, debouncedSearchTerm],
        queryFn: ({ pageParam }) =>
            getLocationsApi({
                ...params,
                page: pageParam ?? 1,
                text_value: debouncedSearchTerm[0]
            }),
        select: (data) => ({
            pages: data.pages.flatMap((p) => p.data.founds),
            pageParams: data.pageParams
        }),
        staleTime: 1000 * 5 * 60, // 5 mins
        refetchOnWindowFocus: true,
        getNextPageParam: (lastPage) => {
            const currentPage = lastPage.data.search_options?.page;
            const pageSize = lastPage.data.search_options?.page_size;
            const totalCount = lastPage.data.search_options?.total_count;
            if (currentPage && pageSize && totalCount) {
                const nextPage = currentPage + 1;
                return currentPage * pageSize < totalCount ? nextPage : undefined;
            }
        },
        initialPageParam: 1
    });

    return { ...query, setSearchTerm };
};
