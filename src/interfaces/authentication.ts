import { UserModel } from "@/interfaces/models/user";

export interface AuthenticationState {
    currentUser?: UserModel | null;
    accessToken?: string | null;
    refreshToken?: string;
    roles: string[];
}
