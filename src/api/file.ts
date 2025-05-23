import evChargerService from "@/config/axios/evChargerService";

export const uploadFileApi = (file: FormData) => {
    return evChargerService.post<string>("/media", file, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

export const deleteFileApi = (fileName: string) => evChargerService.delete(`/media/${fileName}`);
