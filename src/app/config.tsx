"use client";

import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { getSession, SessionProvider } from "next-auth/react";
import { ConfigProvider as AntdConfigProvider } from "antd";
import { addMethod, boolean, number, string } from "yup";

import theme from "@/config/theme/themeConfig";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import { store } from "@/store";
import { initHttpClient } from "@/config/axios/interceptor";
import { QueryClientProvider } from "@/HOC/QueryClientProvider";
import { getAccessToken } from "@/utils/token";

// Yup declaration merging
addMethod(number, "emptyStringTo", function emptyStringTo(type: null | undefined) {
    return this.transform((value) => {
        if (isNaN(value)) {
            return type;
        }

        return value;
    });
});

addMethod(string, "emptyStringTo", function emptyStringTo(type: null | undefined) {
    return this.transform((value) => {
        if (value === "") {
            return type;
        }

        return value;
    });
});

addMethod(boolean, "valueToBoolean", function valueToBoolean() {
    return this.transform((value) => {
        return !!value;
    });
});

// must init http client in client component. Don't know why yet
initHttpClient(() => {
    return getAccessToken(store, async () => {
        const data = await getSession();
        return data?.accessToken ?? "";
    });
});

const Configs: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider>
        <ReduxProvider store={store}>
            <StyledComponentsRegistry>
                <AntdConfigProvider theme={theme}>
                    <SessionProvider>{children}</SessionProvider>
                </AntdConfigProvider>
            </StyledComponentsRegistry>
        </ReduxProvider>
    </QueryClientProvider>
);

export default Configs;
