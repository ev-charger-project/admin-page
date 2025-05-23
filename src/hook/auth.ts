import { signIn, signOut } from "next-auth/react";

import { useAppSelector } from "@/store";

export const useAuth = () => {
    const userOid = useAppSelector((state) => state.authentication.currentUser?.id);
    //const { mutateAsync: deleteToken } = useDeleteFCMToken();

    const loginAzure = () => {
        return signIn(
            "azure-ad-b2c",
            { redirect: true }
            //getLoginParams(isExternal),
        );
    };

    const logout = async () => {
        if (userOid) {
            try {
                //await deleteToken({ token: fcmToken, user_oid: userOid });
            } catch (error) {
                console.error(error);
            }
        }
        signOut().then(() => {});
    };

    return { loginAzure, logout };
};
