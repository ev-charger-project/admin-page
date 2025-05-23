import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RouterState, ShouldNavigateItem } from "@/interfaces/router";

const initialState: RouterState = {
    shouldNavigates: []
};

export const routerSlice = createSlice({
    name: "router",
    initialState,
    reducers: {
        setShouldNavigates(state, action: PayloadAction<ShouldNavigateItem[]>) {
            state.shouldNavigates = action.payload;
        },
        resetState() {
            return initialState;
        }
    }
});

export const routerActions = routerSlice.actions;
