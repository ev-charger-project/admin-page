import { UnknownAction, ThunkAction } from "@reduxjs/toolkit";
import { AuthenticationState } from "./authentication";
import { RouterState } from "./router";

export type ReduxStoreState = {
    authentication: AuthenticationState;
    router: RouterState;
};
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppThunk<ReturnType = UnknownAction> = ThunkAction<ReturnType, ReduxStoreState, unknown, UnknownAction>;
