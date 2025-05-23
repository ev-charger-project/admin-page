import { createSelector } from "@reduxjs/toolkit";
import { ReduxStoreState } from "@/interfaces/redux";

export const selectShouldNavigate = createSelector(
    (state: ReduxStoreState) => {
        return state.router;
    },
    (router) => {
        return !router.shouldNavigates.some((i) => !i.shouldNavigate);
    }
);
