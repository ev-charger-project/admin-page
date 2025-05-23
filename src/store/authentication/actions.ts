import { authenticationActions } from "./slice";
import { AppThunk } from "@/store";

export const setAccessTokenThunk =
    (accessToken: string | null): AppThunk<void> =>
    (dispatch) => {
        dispatch(authenticationActions.setAccessToken(accessToken));
    };
