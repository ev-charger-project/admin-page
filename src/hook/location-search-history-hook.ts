import {
    CreateLocationSearchHistoryPayload,
    UpdateLocationSearchHistoryPayload,
    GetListLocationSearchHistoryParams
} from "@/interfaces/location-search-history";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createLocationSearchHistoryApi,
    deleteLocationSearchHistoryApi,
    getLocationSearchHistoryApi,
    getLocationSearchHistoriesApi,
    updateLocationSearchHistoryApi
} from "@/api/location-search-history";
import { LOCATION_SEARCH_HISTORY } from "@/constant/query";
import { useDebounceValue } from "usehooks-ts";
import { useState } from "react";

export function useGetLocationSearchHistoryList(params: GetListLocationSearchHistoryParams) {
    return useQuery({
        queryKey: [LOCATION_SEARCH_HISTORY, params],
        queryFn: () => getLocationSearchHistoriesApi(params),
        select: ({ data }) => data
    });
}

export function useGetLocationSearchHistory(id?: string) {
    return useQuery({
        queryKey: [LOCATION_SEARCH_HISTORY, id],
        queryFn: () => {
            if (!id) return Promise.reject("Id is required");
            return getLocationSearchHistoryApi(id);
        },
        select: ({ data }) => data
    });
}

export function useCreateLocationSearchHistory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateLocationSearchHistoryPayload) => createLocationSearchHistoryApi(data),
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    predicate: (query) => query.queryKey[0] === LOCATION_SEARCH_HISTORY
                })
                .then(() => {});
        }
    });
}

export function useUpdateLocationSearchHistory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateLocationSearchHistoryPayload) => updateLocationSearchHistoryApi(data),
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    predicate: (query) => query.queryKey[0] === LOCATION_SEARCH_HISTORY
                })
                .then(() => {});
        }
    });
}

export function useDeleteLocationSearchHistory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteLocationSearchHistoryApi(id),
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    predicate: (query) => query.queryKey[0] === LOCATION_SEARCH_HISTORY
                })
                .then(() => {});
        }
    });
}

export const useGetListLocationSearchHistoryInfinite = (params: GetListLocationSearchHistoryParams) => {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounceValue(searchTerm, 300);

    const query = useInfiniteQuery({
        queryKey: [LOCATION_SEARCH_HISTORY, params, debouncedSearchTerm],
        queryFn: ({ pageParam }) =>
            getLocationSearchHistoriesApi({
                ...params,
                page: pageParam ?? 1,
                // TODO: implement search term
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
