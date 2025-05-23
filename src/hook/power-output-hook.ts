import {
    createPowerOutputApi,
    deletePowerOutputApi,
    getPowerOutputApi,
    getPowerOutputsApi,
    updatePowerOutputApi
} from "@/api/power-output";
import { POWER_OUTPUT } from "@/constant/query/power-output";
import { GetListPowerOutputParams, PowerOutputPayload, UpdatePowerOutputPayload } from "@/interfaces/power-output";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetPowerOutputList(params: GetListPowerOutputParams) {
    return useQuery({
        queryKey: [POWER_OUTPUT, params],
        queryFn: () => getPowerOutputsApi(params),
        select: ({ data }) => data
    });
}

export function useGetPowerOutput(id?: string) {
    return useQuery({
        queryKey: [POWER_OUTPUT, id],
        queryFn: () => {
            if (!id) {
                return Promise.reject("Id is required");
            }
            return getPowerOutputApi(id);
        },
        select: ({ data }) => data
    });
}

export function useCreatePowerOutput() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: PowerOutputPayload) => createPowerOutputApi(data),
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    predicate: (query) => query.queryKey[0] === POWER_OUTPUT
                })
                .then(() => {});
        }
    });
}

export function useUpdatePowerOutput() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdatePowerOutputPayload) => updatePowerOutputApi(data),
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    predicate: (query) => query.queryKey[0] === POWER_OUTPUT
                })
                .then(() => {});
        }
    });
}

export function useDeletePowerOutput() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deletePowerOutputApi(id),
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    predicate: (query) => query.queryKey[0] === POWER_OUTPUT
                })
                .then(() => {});
        }
    });
}

export const useGetListPowerOutputInfinite = (params: GetListPowerOutputParams) => {
    const query = useInfiniteQuery({
        queryKey: [POWER_OUTPUT, params],
        queryFn: ({ pageParam }) =>
            getPowerOutputsApi({
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
