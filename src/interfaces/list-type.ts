interface ListType<T> {
    founds: T[];
    search_options: ListProperties;
}

interface ListProperties {
    ordering: string;
    page: number;
    page_size: number;
    order_by: string;
    total_count: number;
}

export type { ListType, ListProperties };
