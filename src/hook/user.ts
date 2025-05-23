import { useQuery } from "@tanstack/react-query";
import { getMeApi } from "@/api/user";
import { USER_ME } from "@/constant/query";

export const useGetMe = (enabled: boolean) => {
    return useQuery({
        queryKey: [USER_ME],
        queryFn: () => getMeApi(),
        select: ({ data }) => data,
        enabled
    });
};
