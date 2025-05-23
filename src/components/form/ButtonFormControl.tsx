import React, { ReactNode, useEffect, useState } from "react";
import { Button } from "antd";
import { ButtonWrapper } from "@/interfaces/form";

type ButtonFormControlProps = {
    value: any;
    children: ReactNode;
    onClick: () => void;
} & ButtonWrapper;

const ButtonFormControl: React.FC<ButtonFormControlProps> = ({ children, value, buttonLabel, isButton, onClick }) => {
    const [isActive, setIsActive] = useState<boolean>(false);

    useEffect(() => {
        if (Array.isArray(value)) {
            setIsActive(!!value.length);
        } else {
            setIsActive(!!value);
        }
    }, [value]);

    return isButton ? (
        <div
            style={{
                position: "relative"
            }}>
            <div
                style={{
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    zIndex: -1,
                    width: "100%",
                    height: "100%",
                    opacity: "0"
                }}>
                {children}
            </div>
            <Button
                style={{
                    color: "#d9d9d9",
                    fontWeight: "500",
                    padding: "4px 14px",
                    border: isActive ? "" : "1.5px solid #d9d9d9",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    width: "100%"
                }}
                type={isActive ? "primary" : "default"}
                onClick={onClick}>
                {buttonLabel}
            </Button>
        </div>
    ) : (
        <>{children}</>
    );
};

export default ButtonFormControl;
