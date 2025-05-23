import React, { CSSProperties, FC } from "react";
import { Button, Typography } from "antd";

import { c } from "@/utils/string";

import { themeConstants } from "@/constant/theme";

type ButtonProps = {
    title?: string;
    customSize?: "sm" | "md" | "lg";
    customType?: "primary" | "action" | "danger" | "secondary";
    customDisabled?: boolean;
    customTextStyles?: CSSProperties;
    style?: CSSProperties;
} & React.ComponentProps<typeof Button>;

const SharedButton: FC<ButtonProps> = ({
    children,
    title,
    customSize = "md",
    customType = "primary",
    customDisabled = false,
    style,
    customTextStyles,
    ...props
}) => {
    return (
        <Button
            type="primary"
            style={{
                ...getButtonStyle(customSize, customType, customDisabled),
                ...style
            }}
            disabled={customDisabled}
            {...props}>
            {title ? (
                <Typography
                    style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: themeConstants.btnTextDefault,
                        lineHeight: "16px",
                        ...customTextStyles
                    }}>
                    {c(title)}
                </Typography>
            ) : (
                children
            )}
        </Button>
    );
};

export default SharedButton;

const getButtonStyle = (size: string, type: string, customDisabled: boolean): CSSProperties => {
    const buttonStyle: CSSProperties = {
        height: 40,
        width: "fit-content",
        minWidth: 120,
        padding: "12px 16px",
        backgroundColor: themeConstants.btnPrimaryDefault,
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        borderRadius: 4
    };
    switch (type) {
        case "action":
            buttonStyle.backgroundColor = customDisabled
                ? themeConstants.btnPrimaryDisabled
                : themeConstants.btnActionDefault;
            break;
        case "danger":
            buttonStyle.backgroundColor = customDisabled
                ? themeConstants.btnPrimaryDisabled
                : themeConstants.btnDangerDefault;
            break;
        case "secondary":
            buttonStyle.backgroundColor = customDisabled
                ? themeConstants.btnPrimaryDisabled
                : themeConstants.btnSecondaryDefault;
            break;
        default:
            buttonStyle.backgroundColor = customDisabled
                ? themeConstants.btnPrimaryDisabled
                : themeConstants.btnPrimaryDefault;
    }
    switch (size) {
        case "sm":
            buttonStyle.height = 40;
            buttonStyle.fontWeight = 600;
            buttonStyle.lineHeight = "16px";
            break;
        case "md":
            buttonStyle.height = 40;
            buttonStyle.fontWeight = 600;
            buttonStyle.lineHeight = "16px";
            break;
        case "lg":
            buttonStyle.height = 48;
            buttonStyle.fontWeight = 700;
            buttonStyle.lineHeight = "18px";
            break;
        default:
            buttonStyle.height = 40;
            buttonStyle.fontWeight = 600;
            buttonStyle.lineHeight = "16px";
    }
    return { ...buttonStyle };
};
