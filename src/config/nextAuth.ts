import { AuthOptions } from "next-auth";
import { checkTokenExpired, refreshAccessToken } from "@/utils/token";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
    logger: {
        error: (code, metadata) => {
            console.log(`[${new Date().toUTCString()}] error - ${code} - ${metadata}`);
        },
        debug: (code, metadata) => {
            console.log(`[${new Date().toUTCString()}] debug - ${code} - ${metadata}`);
        },
        warn: (code) => {
            console.log(`[${new Date().toUTCString()}] warn - ${code}`);
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: "Sign in with credentials",
            type: "credentials",
            id: "ev-charger-provider",
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)
                const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_BASE_URL}/api/v1/auth/sign-in`, {
                    method: "POST",
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" }
                });
                const user = await res.json();
                // If no error and we have user data, return it
                if (res.ok && user) {
                    return user;
                }
                // Return null if user data could not be retrieved
                return null;
            }
        })
    ],
    callbacks: {
        jwt: async ({ token, account, user }) => {
            if (user && account?.type == "credentials") {
                token.accessToken = user.access_token;
                token.refreshToken = user.refresh_token;
                return Promise.resolve(token);
            }
            const accessToken = typeof token.accessToken === "string" ? token.accessToken : "";
            const refreshToken = typeof token.refreshToken === "string" ? token.refreshToken : "";

            if (checkTokenExpired(accessToken)) {
                try {
                    const res = await refreshAccessToken({ refreshToken });
                    token.accessToken = res.access_token;
                    token.refreshToken = res.refresh_token;
                    return Promise.resolve({
                        ...token
                    });
                } catch (e) {
                    console.error(e);
                    return Promise.resolve({
                        ...token
                    });
                }
            }

            return Promise.resolve(token);
        },
        session: async ({ session, token }) => {
            return Promise.resolve({
                ...session,
                accessToken: token.accessToken
            });
        }
    },
    events: {
        signOut: async (message) => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_AUTH_SERVICE_BASE_URL}/api/v1/auth/sign-out?token=${message.token.refreshToken}`,
                {
                    method: "DELETE"
                }
            );
            if (res.ok) {
                return await res.json();
            }
            return null;
        }
    },
    pages: {
        //      signIn: '/auth/sign-in',
        newUser: "/auth/sign-up",
        error: "/auth/sign-in"
    },
    debug: false
};
