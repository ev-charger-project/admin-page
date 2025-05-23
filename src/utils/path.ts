// NOTE: return "" if there is no next path, return next path if there is next path
// Example: "/dashboard/users/1" => "/users/1"

import { RouteConfig } from "@/interfaces/route";

// Example: "/dashboard" => ""
export const getNextPath = (path: string): string => {
    const list = path.split("/");
    if (list.length > 2) {
        return "/" + list.slice(2).join("/");
    }
    return "";
};

type Path = { path: string; routeName: string };

export const getRoutesConfigPaths = (rc: RouteConfig, parentPath?: string): Path[] => {
    const res: Path[] = [];
    const currentPath = parentPath ?? "";
    for (const r of rc) {
        if (!r.children) {
            res.push({
                path: currentPath + r.path,
                routeName: r.name
            });
        } else {
            res.push(...getRoutesConfigPaths(r.children, currentPath + r.path));
            res.push({ path: currentPath + r.path, routeName: r.name });
        }
    }
    return res;
};

export const checkPathnameMatchRoute = (pathname: string, route: string) => {
    const patternString = route.replace(/\{([^[\]]+)\}/g, "([^\\/]+)");
    try {
        const pattern = new RegExp(`^${patternString}$`);
        return pattern.test(pathname);
    } catch {
        return false;
    }
};
