import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthenticationState } from "@/interfaces/authentication";
import { Undefinedable } from "@/interfaces/base";
import { UserModel } from "@/interfaces/models/user";

const initialState: AuthenticationState = {
    accessToken: undefined,
    refreshToken: undefined,
    currentUser: undefined,
    roles: []
};

export const authenticationSlice = createSlice({
    name: "authentication",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserModel | null>) {
            state.currentUser = action.payload;
        },
        setAccessToken(state, action: PayloadAction<string | null>) {
            state.accessToken = action.payload;
        },
        setRefreshToken(state, action: PayloadAction<string>) {
            state.refreshToken = action.payload;
        },
        setRoles(state, action: PayloadAction<string[]>) {
            state.roles = action.payload;
        },
        resetState(_, action: PayloadAction<Undefinedable<AuthenticationState> | undefined>) {
            return { ...initialState, ...action.payload };
        }
    }
});

export const authenticationActions = authenticationSlice.actions;
