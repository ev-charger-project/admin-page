// nextauth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
        access_token: string;
        refresh_token: string;
    }

    interface Session extends DefaultSession {
        accessToken: string;
        user?: User;
    }
}
