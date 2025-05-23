import { createSelector } from "@reduxjs/toolkit";
import { ReduxStoreState } from "@/interfaces/redux";

export const selectIsAuthenticated = createSelector(
    (state: ReduxStoreState) => {
        return state.authentication.currentUser;
    },
    (user) => {
        return user;
    }
);

export const selectUserRoles = createSelector(
    (state: ReduxStoreState) => {
        return state.authentication.roles;
    },
    (roles) => {
        return roles;
    }
);

export const selectUserInfo = createSelector(
    (state: ReduxStoreState) => {
        return state.authentication.currentUser;
    },
    (user) => {
        return user;
    }
);

export const selectIsUserSet = createSelector(
    (state: ReduxStoreState) => state.authentication.currentUser,
    (user) => user !== undefined
);

export const selectIsAccessTokenSet = createSelector(
    (state: ReduxStoreState) => state.authentication.accessToken,
    (accessToken) => accessToken !== undefined // undefined means not set yet. If useSession return unauthenticated, set accessToken to null
);
