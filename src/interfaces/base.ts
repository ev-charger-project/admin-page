//TODO: fix this interface

export interface MetaData {
    created_at: string;
    updated_at: string;
    updated_by: string;
    created_by: string;
    is_deleted: boolean;
    version: number;
}

export interface GetListResponse<T> {
    total: number;
    data: T[];
    pagination: {
        current_token: number;
        page_size: number;
        next_token: number | null;
    };
}

export interface FilterBase<T extends Record<string, any>> {
    page?: number;
    page_size?: number;
    ordering?: "desc" | "asc";
    order_by: keyof T;
    text_value?: string;
}

export type Nullable<T> = { [K in keyof T]: T[K] | null };
export type Undefinedable<T> = { [K in keyof T]?: T[K] | undefined };
