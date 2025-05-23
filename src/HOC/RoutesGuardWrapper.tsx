"use client";

import { FC, ReactNode, useEffect, useMemo } from "react";
import intersection from "lodash/intersection";

import LoadingOverlay from "@/components/LoadingOverlay";
import { useAppSelector } from "@/store";
import { selectIsAuthenticated, selectUserRoles } from "@/store/authentication";
import { useRouter } from "@/hook/router";
import React from "react";

const useRouteGuard = () => {
    const { configsMatchPath } = useRouter();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const roles = useAppSelector(selectUserRoles);

    const authStatus = isAuthenticated ? "authenticated" : "unauthenticated";

    const isAllowedToPass = useMemo(() => {
        for (const config of configsMatchPath) {
            const isValidAuthType = !config.type || config.type === "public" || config.type === authStatus;

            const isValidRole = config.roles.includes("*") || intersection(config.roles, roles).length;

            if (!isValidAuthType || !isValidRole) {
                return false;
            }
        }

        return true;
    }, [authStatus, configsMatchPath, roles]);

    return { isAllowedToPass };
};

const RouteGuardWrapper: FC<{ children: ReactNode }> = ({ children }) => {
    const router = useRouter();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const roles = useAppSelector(selectUserRoles);
    const { isAllowedToPass } = useRouteGuard();

    const redirectPath = useMemo(() => {
        if (!isAuthenticated) {
            return router.paths.get("home");
        }

        if (roles.includes("admin")) {
            return router.paths.get("dashboard");
        }

        return "";
    }, [isAuthenticated, router.paths, roles]);

    useEffect(() => {
        if (isAllowedToPass) {
            return;
        }
        router.push(redirectPath);
    }, [isAllowedToPass, router, redirectPath]);

    if (isAllowedToPass) {
        return children;
    }

    return <LoadingOverlay />;
};

export default RouteGuardWrapper;
