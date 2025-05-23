import { Skeleton } from "antd";
import React from "react";

export default function Loading() {
    return (
        <Skeleton
            style={{
                margin: "20px 0px"
            }}
            active
        />
    );
}
