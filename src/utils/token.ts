import { jwtDecode } from "jwt-decode";

import axios from "axios";
import { BaseTokenClaims, RefreshAccessTokenParams, RefreshTokenResponse } from "@/interfaces/token";
import { setAccessTokenThunk } from "@/store/authentication";

export const checkTokenExpired = (token: string) => {
    if (!token) {
        throw new Error("No token provided to be decoded");
    }
    const { exp } = jwtDecode<BaseTokenClaims>(token);
    const nowTimeStamp = new Date().getTime();
    return nowTimeStamp > exp * 1000;
};

export const refreshAccessToken = async (params: RefreshAccessTokenParams) => {
    if (!params.refreshToken) {
        throw new Error("Can't refresh token because no refresh_token provided");
    }
    console.log("refreshing access token");
    try {
        const payload = new URLSearchParams();
        payload.append("token", params.refreshToken);
        // should not use baseClient, because it will be intercepted and check for token expiration => infinite loop
        const response = await axios.get<RefreshTokenResponse>(
            `${process.env.NEXT_PUBLIC_AUTH_SERVICE_BASE_URL}/api/v1/auth/refresh-token`,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                params: {
                    token: params.refreshToken
                }
            }
        );

        const { access_token, refresh_token } = response.data;
        return { access_token, refresh_token };
    } catch (error) {
        // console.log({ error });
        // console.log((error as AxiosError).response?.data);
        // console.log((error as AxiosError).config?.headers);
        throw new Error("Something went wrong while refresh access token");
    }
};

export const getAccessToken = async (store: any, getRefreshToken: (refreshToken?: string) => Promise<string>) => {
    const { accessToken, refreshToken } = store.getState().authentication;

    if (accessToken && !checkTokenExpired(accessToken)) {
        return accessToken;
    }
    const newAccessToken = await getRefreshToken(refreshToken);

    store.dispatch(setAccessTokenThunk(newAccessToken));
    return newAccessToken;
};
