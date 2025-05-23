import { GetListEvUserParams, EvUserPayload, UpdateEvUserPayload } from "@/interfaces/ev-user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createEvUserApi, deleteEvUserApi, getEvUserApi, getEvUsersApi, updateEvUserApi } from "@/api/ev-user";
import { EV_USER } from "@/constant/query/ev-user";

export function useGetEvUserList(params: GetListEvUserParams) {
    return useQuery({
        queryKey: [EV_USER, params],
        queryFn: () => getEvUsersApi(params),
        select: ({ data }) => data
    });
}

export function useGetEvUser(id?: string) {
    return useQuery({
        queryKey: [EV_USER, id],
        queryFn: () => {
            if (!id) {
                return Promise.reject("Id is required");
            }
            return getEvUserApi(id);
        },
        select: ({ data }) => data
    });
}

export function useCreateEvUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: EvUserPayload) => createEvUserApi(data),
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    predicate: (query) => query.queryKey[0] === EV_USER
                })
                .then(() => {});
        }
    });
}

export function useUpdateEvUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateEvUserPayload) => updateEvUserApi(data),
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    predicate: (query) => query.queryKey[0] === EV_USER
                })
                .then(() => {});
        }
    });
}

export function useDeleteEvUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteEvUserApi(id),
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    predicate: (query) => query.queryKey[0] === EV_USER
                })
                .then(() => {});
        }
    });
}
