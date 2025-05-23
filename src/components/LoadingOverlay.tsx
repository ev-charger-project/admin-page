import { FC } from "react";
import { Image, Typography } from "antd";
import React from "react";

interface LoadingOverlayProps {}

const LoadingOverlay: FC<LoadingOverlayProps> = () => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "fixed",
                flexDirection: "column",
                gap: "40px",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: "100vw",
                height: "100vh"
            }}>
            <Image src="/next.svg" width={200} height={200} loading="lazy" preview={false} alt={"EV Charger"} />
            <Typography
                style={{
                    fontSize: "max(28px,3vw)",
                    fontWeight: 600,
                    color: "#06417C"
                }}>
                EV Charger
            </Typography>
        </div>
    );
};

export default LoadingOverlay;
