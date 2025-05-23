import { useCallback, useEffect, useMemo } from "react";

import { usePathname, useRouter as useNextRouter } from "next/navigation";

import { NameInto, routesConfig } from "@/config/routes";
import { RouteConfigItem } from "@/interfaces/route";
import { useAppDispatch, useAppSelector } from "@/store";
import { routerActions, selectShouldNavigate } from "@/store/router";
import { NavigateOptions, PrefetchOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { getRoutesConfigPaths } from "@/utils/path";
import { DYNAMIC_PATH_REGEX } from "@/constant/router";

type AdditionOption = { force?: boolean };

export const useRouter = () => {
    const pathname = usePathname();
    const shouldNavigate = useAppSelector(selectShouldNavigate);
    const dispatch = useAppDispatch();

    const router = useNextRouter();
    const getShouldNavigate = () => {
        return shouldNavigate || window.confirm("There are unsaved changes. Do you want to leave?");
    };

    const checkAndNavigate = (cb: () => void, isForce: boolean = false) => {
        const _shouldNavigate = isForce || getShouldNavigate();
        if (_shouldNavigate) {
            cb();
            dispatch(routerActions.setShouldNavigates([]));
        }
    };

    const overrideRouter = {
        push: (href: string, { force, ...options }: NavigateOptions & AdditionOption = {}) =>
            checkAndNavigate(() => router.push(href, options), force),
        replace: (href: string, { force, ...options }: NavigateOptions & AdditionOption = {}) =>
            checkAndNavigate(() => router.replace(href, options), force),
        refresh: ({ force }: AdditionOption = {}) => checkAndNavigate(() => router.refresh(), force),
        back: ({ force }: AdditionOption = {}) => checkAndNavigate(() => router.back(), force),
        forward: ({ force }: AdditionOption = {}) => checkAndNavigate(() => router.forward(), force),
        prefetch: (href: string, props?: PrefetchOptions & AdditionOption) => {
            const options = props ? { kind: props.kind } : undefined;
            return checkAndNavigate(() => router.prefetch(href, options), props?.force);
        }
    };

    const _routesConfig = useMemo(() => routesConfig, []);

    const paths = useMemo(() => {
        const configPaths = getRoutesConfigPaths(_routesConfig);
        return {
            get: (
                routeName: NameInto<typeof _routesConfig>,
                options?: {
                    pathParams?: string[];
                    queryParams?: Record<string, any>;
                }
            ) => {
                let path = configPaths.find((p) => p.routeName === routeName)?.path || "";
                if (options?.pathParams) {
                    for (const param of options.pathParams) {
                        path = path.replace(/{(.*?)}/, param?.toString());
                    }
                }
                const searchParams = new URLSearchParams(
                    options?.queryParams
                        ? Object.fromEntries(
                              Object.entries(options.queryParams).filter(
                                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                  ([_, value]) => {
                                      return value !== undefined;
                                  }
                              )
                          )
                        : undefined
                ).toString();
                return path + (searchParams ? `?${searchParams}` : "");
            }
        };
    }, [_routesConfig]);

    const findConfigsMatchPath = useCallback(() => {
        const pathList = pathname.split("/").map((i) => `/${i}`);
        let routeConfigToFind: readonly RouteConfigItem[] = _routesConfig;
        const result: Pick<RouteConfigItem, "roles" | "type">[] = [];

        if (pathList.length > 1 && pathList[0] === "/") {
            pathList.shift();
        } // remove

        for (const path of pathList) {
            const found = routeConfigToFind.find((c) => {
                if (DYNAMIC_PATH_REGEX.test(c.path)) {
                    return true;
                }
                return c.path === path;
            });
            if (!found) {
                continue;
            }

            result.push({ roles: found.roles, type: found.type });
            routeConfigToFind = found.children || [];
        }
        return result;
    }, [_routesConfig, pathname]);

    const configsMatchPath = useMemo(() => findConfigsMatchPath(), [findConfigsMatchPath]);

    const checkCurrentPathMatch = useCallback(
        (routeName: NameInto<typeof _routesConfig>) => {
            const mustMatch = paths.get(routeName);
            // Escape special characters in the detailProjectPath and replace {id} with a wildcard pattern
            const escapedPath = mustMatch.replace(/\{id\}/g, "\\d+");

            // Create a regular expression from the escaped path
            const regex = new RegExp("^" + escapedPath + "$");

            // Test if the currentPath matches the regular expression
            return regex.test(pathname);
        },
        [pathname, paths]
    );

    return {
        getShouldNavigate,
        ...overrideRouter,
        routesConfig: _routesConfig,
        paths,
        configsMatchPath,
        checkCurrentPathMatch
    };
};

export const useLeaveForm = (isDirty: boolean) => {
    useEffect(() => {
        const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            return window.confirm();
        };
        if (isDirty) {
            window.addEventListener("beforeunload", beforeUnloadHandler);
            return () => {
                window.removeEventListener("beforeunload", beforeUnloadHandler);
            };
        }
    }, [isDirty]);
};
