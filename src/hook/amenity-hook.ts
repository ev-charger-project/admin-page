import { CreateAmenityPayload, UpdateAmenityPayload, GetListAmenityParams } from "@/interfaces/amenity";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAmenityApi, deleteAmenityApi, getAmenityApi, getAmenitiesApi, updateAmenityApi } from "@/api/amenity";
import { AMENITY } from "@/constant/query";
import { useDebounceValue } from "usehooks-ts";
import { useState } from "react";

export function useGetAmenityList(params: GetListAmenityParams) {
    return useQuery({
        queryKey: [AMENITY, params],
        queryFn: () => getAmenitiesApi(params),
        select: ({ data }) => data
    });
}

export function useGetAmenity(id?: string) {
    return useQuery({
        queryKey: [AMENITY, id],
        queryFn: () => {
            if (!id) return Promise.reject("Id is required");
            return getAmenityApi(id);
        },
        select: ({ data }) => data
    });
}

export function useCreateAmenity() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateAmenityPayload) => createAmenityApi(data),
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    predicate: (query) => query.queryKey[0] === AMENITY
                })
                .then(() => {});
        }
    });
}

export function useUpdateAmenity() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateAmenityPayload) => updateAmenityApi(data),
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    predicate: (query) => query.queryKey[0] === AMENITY
                })
                .then(() => {});
        }
    });
}

export function useDeleteAmenity() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteAmenityApi(id),
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    predicate: (query) => query.queryKey[0] === AMENITY
                })
                .then(() => {});
        }
    });
}

export const useGetListAmenityInfinite = (params: GetListAmenityParams) => {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounceValue(searchTerm, 300);

    const query = useInfiniteQuery({
        queryKey: [AMENITY, params, debouncedSearchTerm],
        queryFn: ({ pageParam }) =>
            getAmenitiesApi({
                ...params,
                page: pageParam ?? 1,
                // TODO: implement search term
                amenities_types: debouncedSearchTerm[0]
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
