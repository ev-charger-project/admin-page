"use client";

import { FC, ReactNode } from "react";
import { useSession } from "next-auth/react";
import React from "react";

import FormModalProvider from "./FormModalWrapper";
import NotificationWrapper from "./NotificationWrapper";
import RouteGuardWrapper from "./RoutesGuardWrapper";

import LoadingOverlay from "@/components/LoadingOverlay";
import { GetMeWrapper } from "./GetMeWrapper";
import { TokenHandleWrapper } from "./TokenHandleWrapper";
import { useAuth } from "@/hook/auth";
import ConfirmModalWrapper from "@/HOC/ConfirmModalWrapper";

const Wrappers: FC<{ children: ReactNode }> = ({ children }) => {
    const { logout } = useAuth();
    return (
        <FormModalProvider>
            <ConfirmModalWrapper>
                <TokenHandleWrapper getTokenHook={useSession} loadingElement={<LoadingOverlay />}>
                    <GetMeWrapper loadingElement={<LoadingOverlay />} logout={logout}>
                        <NotificationWrapper>
                            <RouteGuardWrapper>{children}</RouteGuardWrapper>
                        </NotificationWrapper>
                    </GetMeWrapper>
                </TokenHandleWrapper>
            </ConfirmModalWrapper>
        </FormModalProvider>
    );
};

export default Wrappers;
