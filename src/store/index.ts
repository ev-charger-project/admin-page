import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { configureStore, ThunkAction, UnknownAction } from "@reduxjs/toolkit";
import { authenticationSlice } from "@/store/authentication";
import { routerSlice } from "@/store/router";

export const store = configureStore({
    reducer: {
        authentication: authenticationSlice.reducer,
        router: routerSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }),
    devTools: process.env.NODE_ENV !== "production"
});

export type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
export type Store = typeof store;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppThunk<ReturnType = unknown> = ThunkAction<ReturnType, RootState, unknown, UnknownAction>;
