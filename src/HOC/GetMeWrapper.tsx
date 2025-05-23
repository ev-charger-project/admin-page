"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { authenticationActions, selectIsAccessTokenSet, selectIsUserSet } from "@/store/authentication";
import { useGetMe } from "@/hook/user";

type Props = {
    children: React.ReactNode;
    loadingElement: React.ReactNode;
    logout?: () => Promise<void>;
};

export const GetMeWrapper: React.FC<Props> = ({ children, loadingElement, logout }) => {
    const accessToken = useAppSelector((state) => state.authentication.accessToken);
    const isAccessTokenSet = useAppSelector(selectIsAccessTokenSet);
    const isUserSet = useAppSelector(selectIsUserSet);
    const { data, isSuccess, isError, isFetching } = useGetMe(!!accessToken);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!isFetching && isSuccess && data.is_active) {
            dispatch(authenticationActions.setUser(data));
            dispatch(authenticationActions.setRoles(data.is_superuser ? ["admin"] : ["user"]));
        }
        if ((!isFetching && isError) || (isSuccess && !data.is_active)) {
            logout?.();
        }
    }, [isSuccess, dispatch, data, isError, logout, isFetching]);

    if (isAccessTokenSet && !!accessToken && !isUserSet) {
        return loadingElement;
    }

    return children;
};
