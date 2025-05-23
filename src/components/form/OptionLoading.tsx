import React from "react";
import { Spin } from "antd";

const OptionLoading = () => {
    return (
        <div
            style={{
                padding: "30px 10px",
                gap: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
            }}>
            <Spin spinning={true} size="small" />
            <div
                style={{
                    fontSize: "12px",
                    fontWeight: "bold"
                }}>
                Loading...
            </div>
        </div>
    );
};

export default OptionLoading;
