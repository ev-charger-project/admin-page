import { FC } from "react";
import { Spin } from "antd";
import React from "react";

const Loading: FC = () => {
    return (
        <div
            style={{
                display: "flex",
                flex: 1,
                marginTop: "50px",
                flexDirection: "column",
                gap: "20px",
                width: "100%",
                height: "100%"
            }}>
            <Spin />
            <div style={{ textAlign: "center", fontWeight: 500 }}>Loading...</div>
        </div>
    );
};

export default Loading;
