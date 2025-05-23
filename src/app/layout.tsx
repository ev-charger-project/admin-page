import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Configs from "@/app/config";
import Wrappers from "@/HOC";
import React from "react";

const exo = Inter({
    subsets: ["latin"]
});

export const metadata: Metadata = {
    title: "EV Charger Admin",
    description: "Manage your EV chargers with ease"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={exo.className}>
                <Configs>
                    <Wrappers>{children}</Wrappers>
                </Configs>
            </body>
        </html>
    );
}
