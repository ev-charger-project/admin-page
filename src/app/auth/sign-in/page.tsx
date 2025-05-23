"use client";
import React from "react";
import { signIn } from "next-auth/react";

function SignIn(): React.JSX.Element {
    return (
        <>
            <button onClick={() => signIn()}>Sign In</button>
        </>
    );
}

export default SignIn;
