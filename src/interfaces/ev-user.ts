import { FilterBase, MetaData } from "@/interfaces/base";

export interface EvUser extends MetaData {
    id: string;
    email: string;
    password: string;
    name: string;
    phone_number: string | null;
    is_active: boolean;
    image_url: string | null;
    is_superuser: boolean;
}

export interface EvUserPayload
    extends Pick<EvUser, "email" | "image_url" | "is_active" | "name" | "password" | "phone_number" | "is_superuser"> {}

export interface UpdateEvUserPayload extends Pick<EvUser, "id" | keyof EvUserPayload> {}

export type GetListEvUserParams = FilterBase<EvUser>;
export type EvUserModel = EvUser;
