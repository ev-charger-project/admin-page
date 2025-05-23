import {
    GetListPowerPlugTypeParams,
    PowerPlugTypePayload,
    UpdatePowerPlugTypePayload
} from "@/interfaces/power-plug-type";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createPowerPlugTypeApi,
    deletePowerPlugTypeApi,
    getPowerPlugTypeApi,
    getPowerPlugTypesApi,
    updatePowerPlugTypeApi
} from "@/api/power-plug-type";
import { POWER_PLUG_TYPE } from "@/constant/query/power-plug-type";

export function useGetPowerPlugTypeList(params: GetListPowerPlugTypeParams) {
    return useQuery({
        queryKey: [POWER_PLUG_TYPE, params],
        queryFn: () => getPowerPlugTypesApi(params),
        select: ({ data }) => data
    });
}

export function useGetPowerPlugType(id?: string) {
    return useQuery({
        queryKey: [POWER_PLUG_TYPE, id],
        queryFn: () => {
            if (!id) {
                return Promise.reject("Id is required");
            }
            return getPowerPlugTypeApi(id);
        },
        select: ({ data }) => data
    });
}

export function useCreatePowerPlugType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: PowerPlugTypePayload) => createPowerPlugTypeApi(data),
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    predicate: (query) => query.queryKey[0] === POWER_PLUG_TYPE
                })
                .then(() => {});
        }
    });
}

export function useUpdatePowerPlugType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdatePowerPlugTypePayload) => updatePowerPlugTypeApi(data),
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    predicate: (query) => query.queryKey[0] === POWER_PLUG_TYPE
                })
                .then(() => {});
        }
    });
}

export function useDeletePowerPlugType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deletePowerPlugTypeApi(id),
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    predicate: (query) => query.queryKey[0] === POWER_PLUG_TYPE
                })
                .then(() => {});
        }
    });
}

export const useGetListPowerPlugTypeInfinite = (params: GetListPowerPlugTypeParams) => {
    const query = useInfiniteQuery({
        queryKey: [POWER_PLUG_TYPE, params],
        queryFn: ({ pageParam }) =>
            getPowerPlugTypesApi({
                ...params,
                page: pageParam ?? 1
                //TODO: implement search term
                //text_value: debouncedSearchTerm,
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

    return { ...query };
};
