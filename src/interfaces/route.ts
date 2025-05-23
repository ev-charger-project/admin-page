export interface RouteConfigItem {
    name: string;
    path: string;
    type?: "authenticated" | "public" | "unauthenticated";
    roles: readonly string[];
    breadcrumb: string;
    children?: readonly RouteConfigItem[];
}

export type RouteConfig = readonly RouteConfigItem[];
