import React from "react";
import { Skeleton } from "antd";

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <Skeleton
            style={{
                margin: "20px 0px"
            }}
            active
        />
    );
}
