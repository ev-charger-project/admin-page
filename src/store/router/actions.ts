import { routerActions } from "./slice";
import { AppThunk } from "@/store";
import { ShouldNavigateItem } from "@/interfaces/router";

export const removeShouldNavigateItemThunk =
    (id: string): AppThunk<void> =>
    (dispatch, getState) => {
        const shouldNavigates = getState().router.shouldNavigates;
        dispatch(routerActions.setShouldNavigates(shouldNavigates.filter((i) => i.id !== id)));
    };

export const setShouldNavigatesItemThunk =
    (payload: ShouldNavigateItem): AppThunk<void> =>
    (dispatch, getState) => {
        const shouldNavigates = getState().router.shouldNavigates;
        const found = shouldNavigates.find((i) => i.id === payload.id);
        if (found) {
            dispatch(
                routerActions.setShouldNavigates(
                    shouldNavigates.map((item) => {
                        if (item.id === payload.id) {
                            return { ...payload };
                        }
                        return item;
                    })
                )
            );
        } else {
            dispatch(routerActions.setShouldNavigates([...shouldNavigates, payload]));
        }
    };
