import { FunctionComponent, ReactNode, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { authenticationActions, selectIsAccessTokenSet, setAccessTokenThunk } from "@/store/authentication";

interface TokenHandleWrapperProps {
    children: ReactNode;
    loadingElement: ReactNode;
    getTokenHook: () => {
        status: "authenticated" | "loading" | "unauthenticated";
        data:
            | ({
                  accessToken?: string;
                  refreshToken?: string;
              } & Record<string, any>)
            | null;
    };
}

export const TokenHandleWrapper: FunctionComponent<TokenHandleWrapperProps> = ({
    children,
    getTokenHook: useGetToken,
    loadingElement
}) => {
    const { status, data } = useGetToken();
    const dispatch = useAppDispatch();
    const isTokenSet = useAppSelector(selectIsAccessTokenSet);

    useEffect(() => {
        if (status === "unauthenticated") {
            dispatch(setAccessTokenThunk(null));
        }

        if (status === "authenticated" && data?.accessToken) {
            dispatch(authenticationActions.setAccessToken(data.accessToken));
        }

        if (status === "authenticated" && data?.refreshToken) {
            dispatch(authenticationActions.setRefreshToken(data.refreshToken));
        }
    }, [data, dispatch, status]);

    if (!isTokenSet) {
        return loadingElement;
    }

    return children;
};
