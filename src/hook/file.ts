import { useMutation } from "@tanstack/react-query";
import { deleteFileApi, uploadFileApi } from "@/api/file";

export const useFileUpload = () =>
    useMutation({
        mutationFn: uploadFileApi,
        retry: 5
    });

export const useFileDelete = () => useMutation({ retry: 5, mutationFn: deleteFileApi });
