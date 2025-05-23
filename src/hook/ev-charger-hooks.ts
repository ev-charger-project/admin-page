import {
    createEVChargerApi,
    deleteEVChargerApi,
    getEVChargerApi,
    getEVChargersApi,
    updateEVChargerApi
} from "@/api/ev-charger";
import { EV_CHARGER } from "@/constant/query";
import { GetListEVChargerParams, CreateEVChargerPayload, UpdateEVChargerPayload } from "@/interfaces/ev-charger";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetEVChargerList(params: GetListEVChargerParams) {
    return useQuery({
        queryKey: [EV_CHARGER, params],
        queryFn: () => getEVChargersApi(params),
        select: ({ data }) => data
    });
}

export function useGetEVCharger(id?: string) {
    return useQuery({
        queryKey: [EV_CHARGER, id],
        queryFn: () => {
            if (!id) {
                return Promise.reject("Id is required");
            }
            return getEVChargerApi(id);
        },
        select: ({ data }) => data
    });
}

export function useCreateEVCharger() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateEVChargerPayload) => createEVChargerApi(data),
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    predicate: (query) => query.queryKey[0] === EV_CHARGER
                })
                .then(() => {});
        }
    });
}

export function useUpdateEVCharger() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateEVChargerPayload) => updateEVChargerApi(data),
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    predicate: (query) => query.queryKey[0] === EV_CHARGER
                })
                .then(() => {});
        }
    });
}

export function useDeleteEVCharger() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteEVChargerApi(id),
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    predicate: (query) => query.queryKey[0] === EV_CHARGER
                })
                .then(() => {});
        }
    });
}
