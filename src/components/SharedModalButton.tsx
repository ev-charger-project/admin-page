import React, { CSSProperties } from "react";
import { Button } from "antd";

import { c } from "../utils/string";

type ButtonProps = {
    title: "save" | "cancel" | string | React.ReactNode;
    style?: CSSProperties;
} & React.ComponentProps<typeof Button>;

const SharedModalButton = ({ title, style, ...props }: ButtonProps) => {
    return (
        <Button
            type="primary"
            danger={title === "cancel"}
            style={{
                width: 140,
                height: 40,
                borderRadius: 4,
                ...style
            }}
            {...props}>
            {typeof title === "string" ? c(title) : title}
        </Button>
    );
};

export { SharedModalButton };
